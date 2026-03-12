// ============================================================
// app.js v3 — DeOs Discipline iOS × Airbnb Edition
// SF Symbols · Spring Physics · Minimalist · Premium
// ============================================================

const App = {
    current: 'home',
    installEvt: null,
    editId: null,
    selIcon: '🎯',
    selDays: [0, 1, 2, 3, 4, 5, 6],
    selPriority: 'MEDIUM',
    selColor: '#FF385C',
    detailId: null,
    toastTimer: null,

    // ─────────────────── BOOT ───────────────────
    init() {
        // i18n
        i18n.init();

        // Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(e => console.warn('[SW]', e));
        }

        // PWA install
        window.addEventListener('beforeinstallprompt', e => {
            e.preventDefault(); this.installEvt = e; this.showInstallBanner();
        });
        window.addEventListener('appinstalled', () => {
            this.hideInstallBanner(); this.toast(i18n.t('App installed! 📱'), 'success');
        });

        // Seed
        if (DB.getHabits().length === 0) HabitManager.seedExampleHabits();
        BadgeManager.checkAndUnlockBadges();

        // Splash exit
        setTimeout(() => {
            const s = document.getElementById('splash-overlay');
            if (s) {
                s.classList.add('out');
                setTimeout(() => {
                    s.remove();
                    this.checkOnboarding();
                }, 550);
            }
        }, 2100);

        // Routing
        window.addEventListener('hashchange', () => this.route());
        NotificationManager.rescheduleAll();
        this.route();
    },

    checkOnboarding() {
        const done = localStorage.getItem('deos_onboard_done');
        if (!done) {
            this.obStart();
        } else {
            document.getElementById('app').style.display = 'block';
        }
    },

    obStart() {
        const ob = document.getElementById('onboarding');
        const app = document.getElementById('app');
        if (ob) ob.style.display = 'flex';
        if (app) app.style.display = 'none';
        this.updateUIStrings();
    },

    setLang(lang) {
        i18n.set(lang);
        this.updateUIStrings();
        // Update picker UI
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.id === `lang-${lang}`);
        });
        // Update settings checkmarks if visible
        const enCheck = document.getElementById('lang-en-check');
        const frCheck = document.getElementById('lang-fr-check');
        if (enCheck) enCheck.textContent = lang === 'en' ? '✓' : '';
        if (frCheck) frCheck.textContent = lang === 'fr' ? '✓' : '';
    },

    obNext(currId, nextId) {
        document.getElementById(currId).classList.remove('active');
        document.getElementById(nextId).classList.add('active');
    },

    async obRequestNotif() {
        const ok = await NotificationManager.requestPermission();
        if (ok) {
            DB.updateSetting('notificationsEnabled', true);
            this.toast(i18n.t('notif_on'), 'success');
        }
        this.obFinish();
    },

    obFinish() {
        localStorage.setItem('deos_onboard_done', 'true');
        const ob = document.getElementById('onboarding');
        const app = document.getElementById('app');
        if (ob) ob.style.display = 'none';
        if (app) app.style.display = 'block';
        this.renderHome();
    },

    // ─────────────────── ROUTER ───────────────────
    route() {
        const raw = window.location.hash.replace('#', '') || 'home';
        const [scr, id] = raw.split('/');
        if (scr === 'habit' && id) {
            this.detailId = id;
            this.showScreen('detail');
            this.renderDetail(id);
        } else {
            this.showScreen(scr);
            this.renderScreen(scr);
        }
    },

    showScreen(s) {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        const el = document.getElementById(`screen-${s}`);
        if (el) { el.classList.add('active'); this.current = s; }
        // Tab bar active state
        document.querySelectorAll('.tab-item[data-s]').forEach(n =>
            n.classList.toggle('active', n.dataset.s === s)
        );
    },

    renderScreen(s) {
        const MAP = {
            home: 'renderHome',
            add: 'renderAdd',
            stats: 'renderStats',
            awards: 'renderAwards',
            settings: 'renderSettings'
        };
        if (MAP[s]) this[MAP[s]]();
    },

    nav(s) { window.location.hash = s; },

    // ─────────────────── AWARDS ───────────────────
    renderAwards() {
        this.renderLeaderboard();
        this.renderBadges();
        const ds = StatsManager.getDashboardStats();
        const bc = document.getElementById('bdg-count');
        if (bc) bc.textContent = `${ds.badges.unlocked}/${ds.badges.total}`;
    },

    // ─────────────────── HOME ───────────────────
    renderHome() {
        const stats = StatsManager.getDashboardStats();
        const quote = QuoteManager.getTodayQuote();
        const now = new Date();

        // Header
        this.setText('greeting-text', this.greeting(now.getHours()));
        this.setText('date-text', now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));

        // Progress ring
        this.animateRing('#ring-fill', stats.today.progress, 45);
        this.animateNum('prog-pct', stats.today.progress, '%');

        // Stats
        this.animateNum('hero-streak', stats.globalBestStreak);
        this.animateNum('hero-done', stats.today.done);
        this.animateNum('hero-score', stats.disciplineScore);

        // Quote
        this.setText('qtext', `"${quote.text}"`);
        this.setText('qauthor', `— ${quote.author}`);

        // Habit list
        this.renderHabitList();
    },

    renderHabitList() {
        const habits = HabitManager.getTodayHabits();
        const container = document.getElementById('habits-list');
        if (!container) return;

        const pending = habits.filter(h => !HabitManager.getTodayStatus(h.id));
        const done = habits.filter(h => HabitManager.getTodayStatus(h.id) === 'done');
        const other = habits.filter(h => {
            const s = HabitManager.getTodayStatus(h.id);
            return s === 'skipped' || s === 'postponed';
        });

        // Badge
        const badgeEl = document.getElementById('hab-badge');
        if (badgeEl) badgeEl.textContent = `${pending.length} ${i18n.t('left')}`;

        if (!habits.length) {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">🏁</div>
          <h3>${i18n.t('no_habits_title')}</h3>
          <p>${i18n.t('no_habits_body')}</p>
        </div>`;
            return;
        }

        let html = '';
        if (pending.length) html += pending.map(h => this.hcard(h)).join('');
        if (other.length) html += `<p style="font-size:13px;font-weight:600;color:var(--text-3);margin:16px 0 8px;text-transform:uppercase;letter-spacing:.5px">${i18n.t('skipped_later')}</p>` + other.map(h => this.hcard(h)).join('');
        if (done.length) html += `<p style="font-size:13px;font-weight:600;color:var(--green);margin:16px 0 8px;text-transform:uppercase;letter-spacing:.5px">${i18n.t('completed')} ✓</p>` + done.map(h => this.hcard(h)).join('');

        container.innerHTML = html;
    },

    hcard(h) {
        const status = HabitManager.getTodayStatus(h.id);
        const streak = StreakManager.getStreak(h.id);
        const isDone = status === 'done';
        const col = h.color || '#FF385C';

        const actions = isDone
            ? `<button class="act-btn done-btn" onclick="App.complete('${h.id}','undo')" title="Undo">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
         </button>`
            : `<button class="act-btn" onclick="App.complete('${h.id}','done')" title="Done">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
         </button>
         <button class="act-btn skip-btn" onclick="App.complete('${h.id}','skipped')" title="Skip">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
         </button>`;

        return `
    <div class="hcard ${status || ''}" style="--habit-color:${col};--habit-color-light:${col}18"
      onclick="event.target.closest('.hcard-actions') || App.nav('habit/${h.id}')">
      <div class="hcard-status-bar"></div>
      <div class="hcard-icon">${h.icon}</div>
      <div class="hcard-body">
        <p class="hcard-name">${h.name}</p>
        <div class="hcard-meta">
          ${streak.current > 0 ? `<span class="pill pill-streak">🔥 ${streak.current}d</span>` : ''}
          ${h.reminderTime ? `<span class="pill pill-time">⏰ ${h.reminderTime}</span>` : ''}
        </div>
      </div>
      <div class="hcard-actions">${actions}</div>
    </div>`;
    },

    complete(habitId, action) {
        if (action === 'undo') {
            const today = HabitManager.getTodayDateStr();
            const c = DB.getCompletions();
            if (c[habitId]) { delete c[habitId][today]; DB.set(DB.KEYS.COMPLETIONS, c); }
        } else {
            HabitManager.setCompletion(habitId, action);
            const el = document.querySelector(`[onclick*="${habitId}"]`)?.closest('.hcard');
            if (el && action === 'done') this.particleBurst(el);
            if (action === 'done') {
                const streak = StreakManager.getStreak(habitId);
                if (StreakManager.isMilestone(streak.current))
                    setTimeout(() => this.showMilestone(habitId, streak.current), 600);
                BadgeManager.checkAndUnlockBadges();
            }
            const name = DB.getHabitById(habitId)?.name || '';
            const msgs = {
                done: `✅ "${name}" ${i18n.t('done')}!`,
                skipped: `⏭ ${i18n.t('skipped_later').split(' / ')[0].trim()}`,
                postponed: `🔄 ${i18n.t('skipped_later').split(' / ')[1]?.trim() || i18n.t('skipped_later')}`
            };
            this.toast(msgs[action] || '👍', action === 'done' ? 'success' : 'info');
        }
        this.renderHome();
    },

    particleBurst(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
        const cols = ['#FF385C', '#FFD60A', '#30D158', '#0A84FF', '#BF5AF2'];
        for (let i = 0; i < 14; i++) {
            const p = document.createElement('div');
            p.style.cssText = `position:fixed;width:8px;height:8px;border-radius:50%;
        background:${cols[i % cols.length]};left:${cx}px;top:${cy}px;
        pointer-events:none;z-index:9999;`;
            document.body.appendChild(p);
            const angle = (i / 14) * Math.PI * 2;
            const dist = 45 + Math.random() * 55;
            p.animate([
                { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`, opacity: 0 }
            ], { duration: 550 + Math.random() * 200, easing: 'cubic-bezier(0,0,0.2,1)' }).onfinish = () => p.remove();
        }
    },

    // ─────────────────── ADD HABIT ───────────────────
    renderAdd(habitId = null) {
        this.editId = habitId;
        const h = habitId ? DB.getHabitById(habitId) : null;
        this.selIcon = h?.icon || '🎯';
        this.selDays = h?.days ? [...h.days] : [0, 1, 2, 3, 4, 5, 6];
        this.selPriority = h?.priority || 'MEDIUM';
        this.selColor = h?.color || '#FF385C';

        this.setVal('f-name', h?.name || '');
        this.setVal('f-desc', h?.description || '');
        this.setVal('f-time', h?.reminderTime || '');
        this.setText('add-screen-title', habitId ? i18n.t('edit_habit') : i18n.t('new_habit'));

        this.renderIconGrid();
        this.renderDayRow();
        this.renderPrioRow();
        this.renderColorRow();
        this.updateIconPreview();
    },

    renderIconGrid() {
        const g = document.getElementById('icon-grid');
        if (!g) return;
        g.innerHTML = HABIT_ICONS.map(ic =>
            `<button class="ibtn ${ic === this.selIcon ? 'sel' : ''}" onclick="App.pickIcon('${ic}')">${ic}</button>`
        ).join('');
    },

    pickIcon(ic) {
        this.selIcon = ic;
        document.querySelectorAll('.ibtn').forEach(b => b.classList.toggle('sel', b.textContent === ic));
        this.updateIconPreview();
    },

    renderDayRow() {
        const c = document.getElementById('day-row');
        if (!c) return;
        const lbl = i18n.days();
        c.innerHTML = lbl.map((l, i) =>
            `<button class="day-btn ${this.selDays.includes(i) ? 'sel' : ''}" onclick="App.toggleDay(${i})">${l}</button>`
        ).join('');
    },

    toggleDay(i) {
        const idx = this.selDays.indexOf(i);
        if (idx > -1) this.selDays.splice(idx, 1); else this.selDays.push(i);
        this.renderDayRow();
    },

    renderPrioRow() {
        const c = document.getElementById('prio-row');
        if (!c) return;
        c.innerHTML = Object.entries(PRIORITY_LEVELS).map(([k, p]) =>
            `<button class="prio-btn ${k === this.selPriority ? 'sel' : ''}" onclick="App.pickPrio('${k}')">${i18n.t(k.toLowerCase())}</button>`
        ).join('');
    },

    pickPrio(k) { this.selPriority = k; this.renderPrioRow(); },

    renderColorRow() {
        const cols = ['#FF385C', '#0A84FF', '#30D158', '#FF9F0A', '#BF5AF2', '#32ADE6', '#FF2D55', '#FFD60A', '#AC8E68', '#636366'];
        const c = document.getElementById('color-row');
        if (!c) return;
        c.innerHTML = cols.map(col =>
            `<button class="cbtn ${this.selColor === col ? 'sel' : ''}" style="background:${col}"
       onclick="App.pickColor('${col}')">${this.selColor === col ? '✓' : ''}</button>`
        ).join('');
    },

    pickColor(col) { this.selColor = col; this.renderColorRow(); this.updateIconPreview(); },

    updateIconPreview() {
        const d = document.getElementById('icon-display');
        if (d) { d.textContent = this.selIcon; d.style.background = this.selColor + '20'; }
    },

    saveHabit() {
        const name = document.getElementById('f-name')?.value?.trim();
        if (!name) { this.toast(i18n.t('enter_name'), 'error'); return; }
        if (!this.selDays.length) { this.toast(i18n.t('pick_day'), 'error'); return; }
        const data = {
            name,
            description: document.getElementById('f-desc')?.value?.trim() || '',
            icon: this.selIcon,
            reminderTime: document.getElementById('f-time')?.value || '',
            days: this.selDays,
            priority: this.selPriority,
            color: this.selColor
        };
        let result;
        if (this.editId) {
            result = HabitManager.updateHabit(this.editId, data);
            this.toast(`"${name}" ${i18n.t('updated')}`, 'success');
        } else {
            result = HabitManager.createHabit(data);
            this.toast(`"${name}" ${i18n.t('created')}`, 'success');
        }

        // Auto-schedule alarm if time is set
        if (data.reminderTime && result) {
            NotificationManager.scheduleHabitReminder(result);
        }

        BadgeManager.checkAndUnlockBadges();
        this.nav('home');
    },

    // ─────────────────── DETAIL ───────────────────
    renderDetail(id) {
        const stats = StatsManager.getHabitStats(id);
        if (!stats) { this.nav('home'); return; }
        const { habit, done, completionRate, streak, bestStreak, last7Days } = stats;

        this.setText('d-icon-box', habit.icon);
        this.setText('d-name', habit.name);
        this.setText('d-desc', habit.description || i18n.t('notes_placeholder'));
        this.animateNum('d-streak', streak);
        this.animateNum('d-best', bestStreak);
        this.animateNum('d-done', done);
        this.setText('d-rate', `${completionRate}%`);

        const bar = document.getElementById('d-bar');
        if (bar) { bar.style.width = `${completionRate}%`; bar.style.background = habit.color || 'var(--red)'; }

        // Reminder Status Card
        this.setText('d-time-display', habit.reminderTime || i18n.t('no_reminder_set') || 'No reminder');
        const st = document.getElementById('d-notif-status');
        const hasNotif = !!habit.reminderTime;
        if (st) {
            st.textContent = hasNotif ? 'ON' : 'OFF';
            st.className = `notif-pill ${hasNotif ? 'on' : ''}`;
        }

        const wcal = document.getElementById('d-wcal');
        if (wcal) wcal.innerHTML = last7Days.map(d => `
      <div class="wcal-day">
        <span class="wcal-lbl">${d.label}</span>
        <div class="wcal-dot ${d.status || ''}">
          ${d.status === 'done' ? '✅' : d.status === 'skipped' ? '⏭' : d.status === 'postponed' ? '🔄' : ''}
        </div>
      </div>`).join('');

        const ed = document.getElementById('d-edit');
        if (ed) ed.onclick = () => { this.nav('add'); this.renderAdd(id); };
        const dl = document.getElementById('d-del');
        if (dl) dl.onclick = () => this.confirmDelete(id, habit.name);
    },

    confirmDelete(id, name) {
        const m = document.getElementById('confirm-modal');
        this.setText('conf-title', i18n.t('delete_habit'));
        this.setText('conf-text', i18n.t('delete_confirm', name));
        if (m) {
            m.classList.add('active');
            this.setText('conf-yes', i18n.t('delete_btn'));
            this.setText('conf-no', i18n.t('cancel'));
            document.getElementById('conf-yes').onclick = () => {
                HabitManager.deleteHabit(id);
                m.classList.remove('active');
                this.toast(`"${name}" ${i18n.t('deleted')}`, 'info');
                this.nav('home');
            };
            document.getElementById('conf-no').onclick = () => m.classList.remove('active');
        }
    },

    // ─────────────────── STATS ───────────────────
    renderStats() {
        const ds = StatsManager.getDashboardStats();
        const week = StatsManager.getWeeklyStats();

        // Score ring
        this.animateScoreRing(ds.disciplineScore);
        this.animateNum('s-score', ds.disciplineScore);
        this.setText('s-rate', `${ds.completionRate}%`);
        this.animateNum('s-best', ds.globalBestStreak);
        this.animateNum('s-total', ds.totalCompletions);

        this.renderWeekChart(week);
        this.renderHeatmap();
        this.renderLeaderboard();
        this.renderBadges();

        const bc = document.getElementById('bdg-count');
        if (bc) bc.textContent = `${ds.badges.unlocked}/${ds.badges.total}`;
    },

    animateScoreRing(score) {
        const fill = document.getElementById('score-fill');
        if (!fill) return;
        const r = 44, c = 2 * Math.PI * r;
        fill.style.strokeDasharray = c;
        fill.style.strokeDashoffset = c - (score / 100) * c;
    },

    renderWeekChart(week) {
        const c = document.getElementById('bar-chart');
        if (!c) return;
        const max = Math.max(...week.map(d => d.total), 1);
        const today = HabitManager.getTodayDateStr();
        c.innerHTML = week.map(d => {
            const h = Math.round((d.done / max) * 96);
            const isToday = d.dateStr === today;
            return `<div class="bar-group">
        <div class="bar-wrap">
          <div class="bar ${isToday ? 'today' : ''} ${d.isPerfect ? 'perfect' : ''}"
            style="height:${Math.max(h, 4)}%"></div>
        </div>
        <span class="bar-lbl ${isToday ? 'today' : ''}">${d.label}</span>
      </div>`;
        }).join('');
    },

    renderHeatmap() {
        const c = document.getElementById('heatmap');
        if (!c) return;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const todayStr = HabitManager.getTodayDateStr();
        const cells = [];

        for (let i = 90; i >= 0; i--) {
            const d = new Date(today); d.setDate(d.getDate() - i);
            const dateStr = HabitManager.getDateStr(d);
            const dow = d.getDay();
            const sched = DB.getHabits().filter(h => h.active && h.days.includes(dow));
            let done = 0;
            sched.forEach(h => { if (DB.getCompletionForDate(h.id, dateStr) === 'done') done++; });
            const total = sched.length;
            let level = 0;
            if (total > 0) {
                if (done === 0) level = 0;
                else if (done < total * 0.33) level = 1;
                else if (done < total * 0.66) level = 2;
                else if (done < total) level = 3;
                else level = 4;
            }
            cells.push({ dateStr, level, isToday: dateStr === todayStr });
        }

        c.innerHTML = cells.map(cell =>
            `<div class="hm-cell${cell.isToday ? ' today' : ''}" data-l="${cell.level}"
       title="${cell.dateStr}"></div>`
        ).join('');
    },

    renderLeaderboard() {
        const c = document.getElementById('lb-list');
        if (!c) return;
        const habits = HabitManager.getAllHabits();
        if (!habits.length) { c.innerHTML = `<p style="color:var(--text-3);padding:8px 0">${i18n.t('no_habits_title')}</p>`; return; }

        const ranked = habits.map(h => ({
            ...h,
            rate: StatsManager.getHabitStats(h.id)?.completionRate || 0,
            streak: StreakManager.getStreak(h.id).current
        })).sort((a, b) => b.rate - a.rate);

        const medals = ['gold', 'silver', 'bronze'];
        c.innerHTML = ranked.map((h, i) => `
      <div class="lb-item" onclick="App.nav('habit/${h.id}')">
        <span class="lb-rank ${medals[i] || ''}">${i + 1}</span>
        <div class="lb-icon" style="background:${h.color}18">${h.icon}</div>
        <div class="lb-info">
          <p class="lb-name">${h.name}</p>
          <div class="lb-bar-track"><div class="lb-bar-fill" style="width:${h.rate}%;background:${h.color}"></div></div>
        </div>
        <div class="lb-right">
          <div class="lb-pct" style="color:${h.color}">${h.rate}%</div>
          ${h.streak > 0 ? `<div class="lb-str">🔥 ${h.streak}</div>` : ''}
        </div>
      </div>`).join('');
    },

    renderBadges() {
        const c = document.getElementById('bdg-grid');
        if (!c) return;
        const unlocked = BadgeManager.getUnlockedBadges().map(b => ({ ...b, earned: true }));
        const locked = BadgeManager.getLockedBadges().slice(0, 8).map(b => ({ ...b, earned: false }));
        const all = [...unlocked, ...locked];
        c.innerHTML = all.map(b => {
            const col = BadgeManager.getRarityColor(b.rarity);
            return `<div class="badge-card ${b.earned ? 'earned' : ''}" title="${b.description}">
        <span class="badge-em">${b.earned ? b.emoji : '🔒'}</span>
        <p class="badge-name">${b.name}</p>
        ${b.earned ? `<p class="badge-rarity" style="color:${col}">${b.rarity}</p>` : ''}
      </div>`;
        }).join('');
    },

    // ─────────────────── SETTINGS ───────────────────
    renderSettings() {
        const s = DB.getSettings();
        const tog = document.getElementById('notif-toggle');
        if (tog) tog.classList.toggle('on', s.notificationsEnabled);

        // Language labels
        const enCheck = document.getElementById('lang-en-check');
        const frCheck = document.getElementById('lang-fr-check');
        if (enCheck) enCheck.textContent = i18n.lang === 'en' ? '✓' : '';
        if (frCheck) frCheck.textContent = i18n.lang === 'fr' ? '✓' : '';
    },

    async toggleNotif() {
        const s = DB.getSettings();
        const on = !s.notificationsEnabled;
        if (on) {
            const ok = await NotificationManager.requestPermission();
            if (!ok) { this.toast(i18n.t('notif_blocked'), 'error'); return; }
            NotificationManager.rescheduleAll();
        } else {
            NotificationManager.cancelAllReminders();
        }
        DB.updateSetting('notificationsEnabled', on);
        this.renderSettings();
        this.toast(on ? `🔔 ${i18n.t('notif_on')}` : i18n.t('notif_off'), on ? 'success' : 'info');
    },

    sendTestNotif() {
        const q = QuoteManager.getTodayQuote();
        NotificationManager.showNotification({ title: 'DeOs Discipline 🔥', body: `"${q.text}" — ${q.author}`, tag: 'test' });
        this.toast(`${i18n.t('send_test')} 🔔`, 'success');
    },

    exportData() {
        const blob = new Blob([DB.exportData()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `deos-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        this.toast(i18n.t('export') + ' 💾', 'success');
    },

    resetData() {
        const m = document.getElementById('confirm-modal');
        this.setText('conf-title', i18n.t('reset_all'));
        this.setText('conf-text', i18n.t('reset_confirm') || 'This will delete everything!');
        if (m) {
            m.classList.add('active');
            this.setText('conf-yes', i18n.t('delete_btn'));
            this.setText('conf-no', i18n.t('cancel'));
            document.getElementById('conf-yes').onclick = () => {
                DB.clearAll(); m.classList.remove('active');
                this.toast(i18n.t('reset_all'), 'info');
                setTimeout(() => location.reload(), 800);
            };
            document.getElementById('conf-no').onclick = () => m.classList.remove('active');
        }
    },

    // ─────────────────── INSTALL ───────────────────
    showInstallBanner() { document.getElementById('install-banner')?.classList.add('active'); },
    hideInstallBanner() { document.getElementById('install-banner')?.classList.remove('active'); },
    async promptInstall() {
        if (!this.installEvt) return;
        this.installEvt.prompt();
        const { outcome } = await this.installEvt.userChoice;
        if (outcome === 'accepted') this.toast('Installing DeOs 📱', 'success');
        this.installEvt = null; this.hideInstallBanner();
    },

    // ─────────────────── MILESTONE ───────────────────
    showMilestone(habitId, streak) {
        const msg = StreakManager.getMilestoneMessage(streak);
        const m = document.getElementById('milestone-sheet');
        if (!m) return;
        this.setText('ms-streak', `🔥 ${streak} Days`);
        this.setText('ms-msg', msg || `${streak} day streak — incredible!`);
        m.classList.add('active');
        setTimeout(() => m.classList.remove('active'), 6000);
    },
    closeMilestone() { document.getElementById('milestone-sheet')?.classList.remove('active'); },

    // ─────────────────── BADGE TOAST ───────────────────
    showBadgeToast(badge) {
        const col = BadgeManager.getRarityColor(badge.rarity);
        const t = document.getElementById('badge-toast');
        if (!t) return;
        this.setText('bt-emoji', badge.emoji);
        this.setText('bt-name', badge.name);
        this.setText('bt-desc', badge.description);
        const r = document.getElementById('bt-rarity');
        if (r) { r.textContent = badge.rarity.toUpperCase(); r.style.color = col; }
        t.classList.add('active');
        setTimeout(() => t.classList.remove('active'), 4000);
    },

    // ─────────────────── TOAST ───────────────────
    toast(msg, type = 'info') {
        const t = document.getElementById('app-toast');
        if (!t) return;
        if (this.toastTimer) clearTimeout(this.toastTimer);
        t.textContent = msg;
        t.className = `${type} show`;
        this.toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
    },

    // ─────────────────── ANIMATED COUNTER ───────────────────
    animateNum(id, target, suffix = '') {
        const el = document.getElementById(id);
        if (!el) return;
        const start = parseInt(el.textContent) || 0;
        if (start === target) { el.textContent = target + suffix; return; }
        const dur = 700, step = 16;
        let elapsed = 0;
        const timer = setInterval(() => {
            elapsed += step;
            const p = Math.min(elapsed / dur, 1);
            const ease = 1 - Math.pow(1 - p, 4); // iOS quartic ease-out
            el.textContent = Math.round(start + (target - start) * ease) + suffix;
            if (p >= 1) clearInterval(timer);
        }, step);
    },

    animateRing(selector, percent, r) {
        const el = document.querySelector(selector);
        if (!el) return;
        const c = 2 * Math.PI * r;
        el.style.strokeDasharray = c;
        el.style.strokeDashoffset = c - (percent / 100) * c;
    },

    updateUIStrings() {
        // Splash
        this.setText('splash-sub', i18n.t('splash_subtitle'));

        // Onboarding
        this.setText('ob-lang-title', i18n.t('onboard_lang'));
        this.setText('ob-lang-next', i18n.t('onboard_next'));
        this.setText('ob-notif-title', i18n.t('onboard_notif_title'));
        this.setText('ob-notif-body', i18n.t('onboard_notif_body'));
        this.setText('ob-allow', i18n.t('onboard_notif_btn'));
        this.setText('ob-skip', i18n.t('onboard_notif_skip'));

        // Home
        this.setText('ring-lbl-text', i18n.t('done'));
        this.setText('hero-streak-lbl', i18n.t('streak'));
        this.setText('hero-done-lbl', i18n.t('done'));
        this.setText('hero-score-lbl', i18n.t('score'));
        this.setText('inspiration-lbl', i18n.t('inspiration'));
        this.setText('today-lbl', i18n.t('today'));

        // Add Habit
        this.setText('add-cancel', i18n.t('cancel'));
        this.setText('add-save', i18n.t('done_btn'));
        this.setText('icon-tap-lbl', i18n.t('icon'));
        this.setText('info-lbl', i18n.t('info'));
        this.setText('name-lbl', i18n.t('name_label'));
        this.setText('notes-lbl', i18n.t('notes_label'));
        this.setText('reminder-lbl', i18n.t('reminder_label'));
        this.setText('schedule-lbl', i18n.t('schedule'));
        this.setText('icon-lbl', i18n.t('icon'));
        this.setText('priority-lbl', i18n.t('priority'));
        this.setText('color-lbl', i18n.t('color'));
        const nameInp = document.getElementById('f-name');
        if (nameInp) nameInp.placeholder = i18n.t('name_placeholder');
        const descInp = document.getElementById('f-desc');
        if (descInp) descInp.placeholder = i18n.t('notes_placeholder');

        // Detail
        this.setText('d-best-lbl', i18n.t('best_streak'));
        this.setText('d-done-lbl', i18n.t('completions'));
        this.setText('comp-rate-lbl', i18n.t('completion_rate'));
        this.setText('last7-lbl', i18n.t('last_7_days'));
        this.setText('d-notif-title', i18n.t('notifications'));

        // Stats
        this.setText('stats-title', i18n.t('statistics'));
        this.setText('s-score-lbl', i18n.t('score'));
        this.setText('s-best-lbl', i18n.t('best_streak'));
        this.setText('s-total-lbl', i18n.t('completions'));
        this.setText('s-rate-lbl', i18n.t('success_rate'));
        this.setText('weekly-lbl', i18n.t('weekly_activity'));
        this.setText('heatmap-lbl', i18n.t('heatmap'));
        this.setText('lb-lbl', i18n.t('leaderboard'));
        this.setText('badges-lbl', i18n.t('badges'));

        // Settings
        this.setText('settings-title', i18n.t('settings'));
        this.setText('lang-label', i18n.t('language'));
        this.setText('notif-section-lbl', i18n.t('notifications'));
        this.setText('reminders-lbl', i18n.t('reminders'));
        this.setText('send-test-lbl', i18n.t('send_test'));
        this.setText('data-lbl', i18n.t('data'));
        this.setText('export-lbl', i18n.t('export'));
        this.setText('reset-lbl', i18n.t('reset_all'));
        this.setText('about-lbl', i18n.t('about'));
        this.setText('lang-setting-lbl', i18n.t('language'));
        this.setText('version-lbl', 'v3.1');
        this.setText('current-lang-display', i18n.lang === 'en' ? 'English' : 'Français');

        // Nav
        this.setText('tab-home', i18n.t('home'));
        this.setText('tab-stats', i18n.t('stats'));
        this.setText('tab-awards', i18n.t('awards'));
        this.setText('tab-profile', i18n.t('profile'));

        // Awards
        this.setText('tab-awards-title', i18n.t('awards'));

        // Refresh currently active screen
        this.route();
    },

    // ─────────────────── UTILS ───────────────────
    greeting(h) {
        if (h < 5) return i18n.t('good_night');
        if (h < 12) return i18n.t('good_morning');
        if (h < 17) return i18n.t('good_afternoon');
        if (h < 21) return i18n.t('good_evening');
        return i18n.t('good_night');
    },
    setText(id, val) { const e = document.getElementById(id); if (e) e.textContent = val; },
    setVal(id, val) { const e = document.getElementById(id); if (e) e.value = val; },
};

window.App = App;
document.addEventListener('DOMContentLoaded', () => App.init());
