(function () {
"use strict";
// ── Данные демо «Школа Пример». Все люди и названия выдуманные. ─────────
// Даты считаются от «сегодня» (todayDemo), так что в демо всегда есть уроки
// на сегодня, свежие оценки, темы и посещаемость.

const C1 = "Центральный", C2 = "Северный";
const SAD = "Детский сад", SCH = "Школа";

const p2 = n => String(n).padStart(2, "0");
const fmtDmy = d => p2(d.getDate()) + "." + p2(d.getMonth() + 1) + "." + d.getFullYear();
const parseDmy = s => { const a = String(s).split(".").map(Number); return new Date(a[2], a[1] - 1, a[0]); };
const isoDow = d => { const w = d.getDay(); return w === 0 ? 7 : w; };
const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };

function mulberry(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const YEAR_START = parseDmy("01.09.2026"), YEAR_END = parseDmy("25.05.2027");
const HOL_GENERAL = [["23.11.2026", "29.11.2026"], ["30.12.2026", "10.01.2027"], ["08.03.2027", "14.03.2027"]];
const HOL_C1 = [["16.11.2026", "22.11.2026"], ["30.12.2026", "10.01.2027"], ["08.03.2027", "14.03.2027"]];
function isSchoolDay(d, city) {
  if (isoDow(d) > 5 || d < YEAR_START || d > YEAR_END) return false;
  const hol = (city === C1 ? HOL_C1 : HOL_GENERAL).map(r => [parseDmy(r[0]), parseDmy(r[1])]);
  return !hol.some(r => d >= r[0] && d <= r[1]);
}
// Ближайший прошедший день, когда учатся оба филиала (чтобы «сегодня» в демо всегда было с уроками).
function pickDemoDate(real) {
  const base = new Date(real.getFullYear(), real.getMonth(), real.getDate());
  for (let i = 0; i < 400; i++) {
    const d = addDays(base, -i);
    if (isSchoolDay(d, C1) && isSchoolDay(d, C2)) return d;
  }
  return parseDmy("12.11.2026");
}

const F_FIRST = ["Анна", "Мария", "София", "Виктория", "Алиса", "Полина", "Ева", "Варвара", "Милана", "Ксения", "Дарья", "Елизавета", "Арина", "Вероника", "Таисия", "Злата"];
const M_FIRST = ["Артём", "Михаил", "Матвей", "Тимофей", "Иван", "Лев", "Даниил", "Кирилл", "Егор", "Фёдор", "Роман", "Платон", "Захар", "Макар", "Ярослав", "Глеб"];
const SURN = [["Васильев", "Васильева"], ["Громов", "Громова"], ["Дорофеев", "Дорофеева"], ["Ермолаев", "Ермолаева"], ["Жуков", "Жукова"],
  ["Зимин", "Зимина"], ["Исаев", "Исаева"], ["Калинин", "Калинина"], ["Логинов", "Логинова"], ["Мартынов", "Мартынова"], ["Назаров", "Назарова"],
  ["Осипов", "Осипова"], ["Пахомов", "Пахомова"], ["Румянцев", "Румянцева"], ["Седов", "Седова"], ["Титов", "Титова"], ["Устинов", "Устинова"],
  ["Фадеев", "Фадеева"], ["Хромов", "Хромова"], ["Цветков", "Цветкова"], ["Шубин", "Шубина"], ["Щербаков", "Щербакова"], ["Яковлев", "Яковлева"], ["Андреев", "Андреева"]];
const MOM = ["Ольга", "Наталья", "Екатерина", "Юлия", "Светлана", "Татьяна", "Ирина", "Марина", "Евгения", "Алёна"];
const DAD = ["Сергей", "Алексей", "Дмитрий", "Андрей", "Павел", "Николай", "Владимир", "Максим"];

const SAD_GROUPS = {
  [C1]: [["Младшая", 7, 3], ["Старшая", 7, 5], ["Подготовительная (младшая)", 6, 5], ["Подготовительная (старшая)", 6, 6]],
  [C2]: [["Ясельная", 5, 2], ["Младшая", 6, 3], ["Старшая", 6, 5]],
};
const SCH_GROUPS = {
  [C1]: [["1 класс", 8], ["2 класс", 8], ["3 класс", 8], ["4 класс", 7], ["5 класс", 7]],
  [C2]: [["1 класс", 7], ["2 класс", 7], ["3 класс", 7]],
};

const SUBJ_TOPICS = {
  "Математика": ["Сложение и вычитание в пределах 100", "Таблица умножения на 2 и 3", "Решение задач в два действия", "Периметр прямоугольника", "Деление с остатком", "Порядок действий в выражениях", "Доли и дроби", "Единицы длины и массы", "Умножение на однозначное число", "Числовые лучи и сравнение чисел"],
  "Русский язык": ["Звуки и буквы", "Ударение в словах", "Правописание безударных гласных", "Имя существительное", "Части речи, повторение", "Предложение и его виды", "Однокоренные слова", "Мягкий знак после шипящих", "Составление рассказа по картинке", "Словарный диктант"],
  "Литература": ["Устное народное творчество", "Басни Крылова", "Стихи о природе", "Сказки Пушкина", "Рассказы о детях", "Герой и его поступки", "Чтение по ролям", "Пересказ текста", "Загадки и пословицы", "Работа с произведением"],
  "Окружающий мир": ["Времена года", "Растения нашего края", "Животные и их среда", "Человек и его здоровье", "Вода и её свойства", "Планеты Солнечной системы", "Правила безопасности", "Профессии людей", "Карта и глобус", "Полезные ископаемые"],
  "История": ["Что изучает история", "Жизнь древних людей", "Древний Египет", "Древняя Греция", "Работа с картой", "Культура древних народов", "Повторение темы", "Источники знаний о прошлом"],
  "Английский язык": ["Greetings and introductions", "My family", "Colours and numbers", "Animals", "At school", "Food and drinks", "Present Simple", "My day", "Weather and seasons", "Hobbies"],
  "Физкультура": ["Разминка и строевые упражнения", "Бег на короткие дистанции", "Подвижные игры", "Эстафеты с мячом", "Упражнения на гибкость", "Прыжки через скакалку", "Баскетбол, ведение мяча", "Лазание и равновесие"],
  "Музыка": ["Ритм и мелодия", "Знакомство с инструментами", "Разучивание песни", "Слушаем классику", "Хоровое пение", "Народные мелодии"],
  "ИЗО": ["Тёплые и холодные цвета", "Рисуем осенний пейзаж", "Лепка из пластилина", "Аппликация из бумаги", "Портрет друга", "Натюрморт"],
};
const HOMEWORK = ["Стр. 24, № 3–5", "Выучить правило и выполнить упражнение 2", "Прочитать текст и ответить на вопросы", "Рабочая тетрадь, стр. 12", "Повторить таблицу умножения", "Принести рисунок на тему урока", "Выучить 5 новых слов", "Задание в прописи, стр. 8", "Подготовить пересказ", "Без домашнего задания"];

const CLASS_SUBJECTS = {
  [C1]: {
    "1 класс": ["Математика", "Русский язык", "Окружающий мир", "Английский язык", "Физкультура", "Музыка", "ИЗО"],
    "2 класс": ["Математика", "Русский язык", "Литература", "Окружающий мир", "Английский язык", "Физкультура", "Музыка"],
    "3 класс": ["Математика", "Русский язык", "Литература", "Окружающий мир", "Английский язык", "Физкультура", "ИЗО"],
    "4 класс": ["Математика", "Русский язык", "Литература", "Окружающий мир", "Английский язык", "Физкультура", "Музыка"],
    "5 класс": ["Математика", "Русский язык", "Литература", "История", "Английский язык", "Физкультура", "ИЗО"],
  },
  [C2]: {
    "1 класс": ["Математика", "Русский язык", "Окружающий мир", "Английский язык", "Физкультура", "Музыка"],
    "2 класс": ["Математика", "Русский язык", "Окружающий мир", "Английский язык", "Физкультура", "Музыка"],
    "3 класс": ["Математика", "Русский язык", "Окружающий мир", "Английский язык", "Физкультура", "Музыка"],
  },
};

// Предмет → учитель (по id сотрудника), по городам.
function teacherFor(city, subj) {
  if (city === C1) {
    if (subj === "Математика") return 3;
    if (subj === "Русский язык" || subj === "Литература" || subj === "История") return 4;
    if (subj === "Английский язык" || subj === "Музыка" || subj === "Окружающий мир") return 5;
    return 9; // Физкультура, ИЗО
  }
  if (subj === "Математика" || subj === "Русский язык") return 10;
  return 11;
}

const SLOTS = [["09:00", "09:45"], ["09:55", "10:40"], ["10:50", "11:35"], ["12:00", "12:45"], ["12:55", "13:40"]];

function buildStaff() {
  const mk = (id, name, city, position, pay_type, rate, extra) => Object.assign({
    id, name, city, position, contract_end: "", phone: "+7 900 555-02-" + p2(10 + id), pay_type, monthly_rate: rate, active: true,
    telegram_id: "", lesson_rate: null, extended_day_rate: null, overtime_rate: null, work_start: "09:00", work_end: "18:00",
  }, extra || {});
  return [
    mk(1, "Громова Елена Викторовна", C1, "Завуч", "monthly_fixed", 90000, { telegram_id: "900002" }),
    mk(2, "Орлова Мария Андреевна", C1, "Администратор", "monthly_fixed", 75000, { telegram_id: "900003" }),
    mk(3, "Соколова Ирина Павловна", C1, "Учитель", "per_lesson", null, { lesson_rate: 700, telegram_id: "900001" }),
    mk(4, "Бережной Андрей Николаевич", C1, "Учитель", "per_lesson", null, { lesson_rate: 700 }),
    mk(5, "Морозова Наталья Игоревна", C1, "Учитель", "per_lesson", null, { lesson_rate: 650 }),
    mk(6, "Ковалёва Ольга Сергеевна", C1, "Воспитатель", "monthly_fixed", 60000),
    mk(7, "Фролова Светлана Ивановна", C1, "Воспитатель (подготовительная группа)", "monthly_fixed", 40000, { lesson_rate: 500, extended_day_rate: 800 }),
    mk(8, "Зайцева Анна Олеговна", C1, "Няня", "per_shift", 1800),
    mk(9, "Крылов Денис Алексеевич", C1, "Учитель", "per_lesson", null, { lesson_rate: 650 }),
    mk(10, "Белова Татьяна Юрьевна", C2, "Учитель", "by_class_size", null),
    mk(11, "Никитин Павел Романович", C2, "Учитель", "by_student_count", null),
    mk(12, "Лебедева Юлия Андреевна", C2, "Воспитатель", "monthly_fixed", 58000),
    mk(13, "Тихонова Вера Петровна", C2, "Няня", "per_shift", 1700),
    mk(14, "Андреев Сергей Леонидович", C2, "Администратор", "monthly_fixed", 72000),
    mk(15, "Алексеев Дмитрий Сергеевич", "", "Директор", "monthly_fixed", 150000, { telegram_id: "900004" }),
  ];
}

function buildChildren(rnd, today) {
  const kids = [];
  let id = 1;
  const usedNames = new Set();
  const person = (female) => {
    for (let t = 0; t < 200; t++) {
      const first = (female ? F_FIRST : M_FIRST)[Math.floor(rnd() * 16)];
      const sn = SURN[Math.floor(rnd() * SURN.length)];
      const name = sn[female ? 1 : 0] + " " + first;
      if (!usedNames.has(name)) { usedNames.add(name); return { name, sn }; }
    }
    return { name: "Новикова Алиса " + id, sn: SURN[0] };
  };
  const addKid = (city, dept, group, age, type, until) => {
    const female = rnd() < 0.5;
    const { name, sn } = person(female);
    const dob = new Date(today.getFullYear() - age, Math.floor(rnd() * 12), 1 + Math.floor(rnd() * 27));
    const mom = MOM[Math.floor(rnd() * MOM.length)] + " " + sn[1];
    let parent = mom + " | +7 900 555-01-" + p2(10 + (id % 80)) + " | @parent_" + id;
    if (rnd() < 0.5) parent += "\n" + DAD[Math.floor(rnd() * DAD.length)] + " " + sn[0] + " | +7 900 555-03-" + p2(10 + (id % 80)) + " | ";
    const k = {
      id, name, dob: fmtDmy(dob), city, dept, group, type, until, parent, telegram_id: "",
      allergy: rnd() < 0.12 ? ["Цитрусовые", "Орехи", "Лактоза", "Яйца"][Math.floor(rnd() * 4)] : "Нет",
      date_start: "01.09.2026", cost: dept === SAD ? "32000" : "38000", payment_date: "",
      payment_status: "Оплачено", status: "Активный",
    };
    kids.push(k); id++;
    return k;
  };
  [C1, C2].forEach(city => {
    SAD_GROUPS[city].forEach(([g, n, age]) => {
      for (let i = 0; i < n; i++) addKid(city, SAD, g, age, i % 4 === 3 ? "Полдня" : "Полный", i % 4 === 3 ? "13:00" : "18:00");
    });
    SCH_GROUPS[city].forEach(([g, n]) => {
      const age = 6 + parseInt(g, 10);
      for (let i = 0; i < n; i++) addKid(city, SCH, g, age, "", "");
    });
  });
  // Пара задолженностей, день рождения сегодня и через 2 дня — чтобы «Уведомления» не были пустыми.
  const bd = (k, plus) => { const d = addDays(today, plus); const a = k.dob.split("."); k.dob = p2(d.getDate()) + "." + p2(d.getMonth() + 1) + "." + a[2]; };
  bd(kids[2], 0); bd(kids[9], 2); bd(kids[40], 4);
  kids[5].payment_status = "Задолженность"; kids[14].payment_status = "Задолженность";
  return kids;
}

function buildJournal(children) {
  const subjects = [], schedule = [];
  let subId = 1, schId = 1;
  [C1, C2].forEach(city => {
    Object.keys(CLASS_SUBJECTS[city]).forEach((cls, ci) => {
      const names = CLASS_SUBJECTS[city][cls];
      const sid = {};
      names.forEach(n => { sid[n] = subId; subjects.push({ id: subId, city, class_name: cls, name: n, teacher_staff_id: teacherFor(city, n) }); subId++; });
      for (let w = 1; w <= 5; w++) {
        const rot = names.slice((w * 2 + ci) % names.length).concat(names.slice(0, (w * 2 + ci) % names.length)).slice(0, 5);
        rot.forEach((n, k) => {
          schedule.push({
            id: schId++, city, class_name: cls, weekday: w, time_start: SLOTS[k][0], time_end: SLOTS[k][1],
            subject_id: sid[n], teacher_staff_id: teacherFor(city, n), is_break: false, break_label: "",
          });
        });
        schedule.push({ id: schId++, city, class_name: cls, weekday: w, time_start: "11:35", time_end: "12:00", subject_id: null, teacher_staff_id: null, is_break: true, break_label: "Обед" });
      }
    });
  });
  return { subjects, schedule };
}

// Заполняет журнал за прошедшие дни: темы, ДЗ, посещаемость, оценки.
function fillJournal(S, today, nowMin, rnd) {
  const kidsByClass = {};
  S.children.forEach(c => { if (c.dept === SCH) (kidsByClass[c.city + "|" + c.group] = kidsByClass[c.city + "|" + c.group] || []).push(c); });
  const subById = {}; S.subjects.forEach(s => { subById[s.id] = s; });
  const counters = {};
  const todayDmy = fmtDmy(today);
  for (let d = new Date(YEAR_START); d <= today; d = addDays(d, 1)) {
    const dmy = fmtDmy(d), w = isoDow(d);
    S.schedule.forEach(e => {
      if (e.weekday !== w || e.is_break || !isSchoolDay(d, e.city)) return;
      if (dmy === todayDmy && e.time_start >= "10:50") return; // сегодня заполнены только первые два урока, остальные ждут учителя
      const sub = subById[e.subject_id];
      const key = e.city + "|" + e.class_name + "|" + sub.name;
      counters[key] = (counters[key] || 0);
      const bank = SUBJ_TOPICS[sub.name] || ["Урок"];
      const topic = bank[counters[key] % bank.length];
      counters[key]++;
      const lk = e.id + "|" + dmy;
      S.topics[lk] = topic;
      if (rnd() < 0.75) S.homework[lk] = HOMEWORK[Math.floor(rnd() * HOMEWORK.length)];
      const kids = kidsByClass[e.city + "|" + e.class_name] || [];
      const att = {};
      kids.forEach(k => { att[k.id] = rnd() < 0.93 ? "present" : "absent"; });
      S.jatt[lk] = att;
      kids.forEach(k => {
        if (att[k.id] === "present" && rnd() < 0.3) {
          const r = rnd();
          const v = r < 0.5 ? "5" : r < 0.82 ? "4" : r < 0.96 ? "3" : "2";
          const mod = rnd() < 0.2 ? (rnd() < 0.5 ? "+" : "-") : "";
          S.grades.push({
            id: S.nextId++, city: e.city, class_name: e.class_name, child_id: k.id, subject_id: e.subject_id, date: dmy,
            value: (v === "2" ? v : v + mod), grade_type: rnd() < 0.15 ? "Самостоятельная" : "Урок", comment: "",
            teacher_staff_id: e.teacher_staff_id, schedule_id: e.id,
          });
        }
      });
    });
  }
  // Итоговые за 1 триместр
  Object.keys(kidsByClass).forEach(ck => {
    const [city, cls] = ck.split("|");
    S.subjects.filter(s => s.city === city && s.class_name === cls).forEach(s => {
      kidsByClass[ck].forEach(k => {
        const mine = S.grades.filter(g => g.child_id === k.id && g.subject_id === s.id);
        if (!mine.length) return;
        const avg = mine.reduce((a, g) => a + parseInt(g.value, 10), 0) / mine.length;
        S.periodGrades.push({ id: S.nextId++, city, class_name: cls, child_id: k.id, subject_id: s.id, period: "1 триместр", value: String(Math.max(2, Math.min(5, Math.round(avg)))), teacher_staff_id: s.teacher_staff_id });
      });
    });
  });
}

function fillAttendance(S, today, rnd) {
  const groupsToday = {};
  const todayDmy = fmtDmy(today);
  let gi = 0;
  S.children.filter(c => c.dept === SAD).forEach(c => {
    const gk = c.city + "|" + c.group;
    if (groupsToday[gk] === undefined) groupsToday[gk] = gi++ % 2 === 0; // сегодня отмечена только половина групп
  });
  for (let d = new Date(YEAR_START); d <= today; d = addDays(d, 1)) {
    const dmy = fmtDmy(d);
    S.children.filter(c => c.dept === SAD).forEach(c => {
      if (!isSchoolDay(d, c.city)) return;
      if (dmy === todayDmy && !groupsToday[c.city + "|" + c.group]) return;
      S.attendance.push({ date: dmy, city: c.city, dept: c.dept, group: c.group, name: c.name, status: rnd() < 0.9 ? "present" : "absent", marked_by: "Воспитатель", time: "09:" + p2(10 + Math.floor(rnd() * 40)) });
    });
  }
}

function lessonsTaught(S, staffId, year, month) {
  const out = {};
  S.schedule.forEach(e => {
    if (e.teacher_staff_id !== staffId || e.is_break) return;
    Object.keys(S.topics).forEach(k => {
      const [sid, dmy] = k.split("|");
      if (Number(sid) !== e.id) return;
      const dd = parseDmy(dmy);
      if (dd.getFullYear() === year && dd.getMonth() + 1 === month) out[dmy] = (out[dmy] || 0) + 1;
    });
  });
  return out;
}

function fillStaffAttendance(S, today, rnd) {
  const todayDmy = fmtDmy(today);
  S.staff.forEach(st => {
    S.payAtt[st.id] = {};
    const city = st.city || C1;
    for (let d = new Date(YEAR_START); d <= today; d = addDays(d, 1)) {
      if (!isSchoolDay(d, city)) continue;
      const dmy = fmtDmy(d);
      if (dmy === todayDmy && (st.id === 8 || st.id === 13)) continue; // двое ещё не отмечены сегодня
      const present = rnd() < 0.95;
      const rec = { status: present ? "present" : "absent", is_substitution: false, lessons_count: null, worked_extended_day: false, overtime_hours: 0 };
      if (present && st.position.startsWith("Воспитатель (подг")) { rec.lessons_count = 1 + Math.floor(rnd() * 3); rec.worked_extended_day = rnd() < 0.5; }
      if (present && st.position === "Няня" && rnd() < 0.1) rec.is_substitution = true;
      if (present && rnd() < 0.05) rec.overtime_hours = 1;
      S.payAtt[st.id][dmy] = rec;
    }
  });
}

function seedState(today, nowMin) {
  const rnd = mulberry(20261127);
  const S = {
    v: 1, seedDay: fmtDmy(today), nextId: 1000,
    staff: buildStaff(), children: [], attendance: [], payAtt: {}, paySched: {},
    subjects: [], schedule: [], subs: [], grades: [], periodGrades: [],
    topics: {}, homework: {}, jatt: {}, bookings: [], waitlist: [], trials: [], links: {},
    seenAnnouncements: [],
  };
  S.children = buildChildren(rnd, today);
  const j = buildJournal(S.children);
  S.subjects = j.subjects; S.schedule = j.schedule;
  fillJournal(S, today, nowMin, rnd);
  fillAttendance(S, today, rnd);
  fillStaffAttendance(S, today, rnd);

  // Расписание выходов на завтра/послезавтра
  const t1 = fmtDmy(addDays(today, 1));
  S.paySched[t1] = [6, 7, 8, 12];

  // Родитель: двое детей-школьников из Центрального
  const k1 = S.children.find(c => c.city === C1 && c.group === "3 класс");
  const k2 = S.children.find(c => c.city === C1 && c.group === "1 класс");
  S.parentChildIds = [k1.id, k2.id];
  S.links[k1.id] = [{ telegram_id: "900005", telegram_username: "parent_demo", telegram_name: "Родитель Демо", linked_at: "03.09.2026" }];
  S.links[k2.id] = [{ telegram_id: "900005", telegram_username: "parent_demo", telegram_name: "Родитель Демо", linked_at: "03.09.2026" }];

  // Заявки на пробные и лист ожидания
  const mkB = (row, city, dept, child, age, type, status, wished, parent, phone, tgn, conf) => ({
    row_num: row, tg_id: "7000" + row, date: fmtDmy(addDays(today, -row % 5)), parent, phone, city, dept, child_name: child, child_age: age, type,
    status, wished_date: wished, confirmed_date: conf || "", telegram: tgn, contact_status: "Не связывались",
  });
  const wd = n => fmtDmy(addDays(today, n));
  S.bookings = [
    mkB(101, C1, SCH, "Лебедев Артём", "7 лет", "Заявка: пробное", "Заявка отправлена", wd(2), "Анна Лебедева", "+7 900 555-04-01", "@anna_l"),
    mkB(102, C1, SAD, "Ковалева Мира", "4 года", "Ознакомление", "Заявка отправлена", wd(3), "Игорь Ковалев", "+7 900 555-04-02", "@igor_k"),
    mkB(103, C1, SCH, "Романова Ульяна", "8 лет", "Школа", "Заявка: контакты отправлены", wd(1), "Елена Романова", "+7 900 555-04-03", ""),
    mkB(104, C1, SAD, "Белов Мирон", "3 года", "Заявка: пробное", "ПОДТВЕРЖДЕНО", wd(1), "Ксения Белова", "+7 900 555-04-04", "@ksenia_b", wd(1)),
    mkB(201, C2, SAD, "Осипова Лея", "2 года", "Заявка: пробное", "Заявка отправлена", wd(2), "Мария Осипова", "+7 900 555-04-05", "@maria_o"),
    mkB(202, C2, SCH, "Тимофеев Ян", "6 лет", "Школа", "Заявка отправлена", wd(4), "Артём Тимофеев", "+7 900 555-04-06", "@artem_t"),
  ];
  S.bookings[1].contact_status = "Написали, ждём ответ";
  S.bookings[3].contact_status = "Подтвердили в переписке";
  S.waitlist = [
    { id: 1, created_at: fmtDmy(addDays(today, -6)) + " 11:20", city: C1, department: SCH, group_name: "2 класс", child_name: "Смирнов Лука", child_age: "8 лет", parent_name: "Виктор Смирнов", phone: "+7 900 555-05-01", telegram_id: "7100001", telegram_username: "viktor_s", source: "бот", note: "Нужен подвоз" },
    { id: 2, created_at: fmtDmy(addDays(today, -3)) + " 16:05", city: C1, department: SAD, group_name: "Старшая", child_name: "Крылова Майя", child_age: "5 лет", parent_name: "Дарья Крылова", phone: "+7 900 555-05-02", telegram_id: "7100002", telegram_username: "", source: "бот", note: "" },
    { id: 3, created_at: fmtDmy(addDays(today, -2)) + " 09:40", city: C2, department: SCH, group_name: "1 класс", child_name: "Зуев Тихон", child_age: "7 лет", parent_name: "Олег Зуев", phone: "+7 900 555-05-03", telegram_id: "7100003", telegram_username: "oleg_z", source: "бот", note: "" },
  ];
  S.trials = S.bookings.filter(b => b.status === "ПОДТВЕРЖДЕНО").map(b => ({
    parent_raw: b.parent + "|" + b.telegram, phone: b.phone, city: b.city, dept: b.dept, child_name: b.child_name, child_age: b.child_age,
    date: b.confirmed_date, notes: "", telegram_id: b.tg_id,
  }));
  return S;
}

// ── Фальшивый бэкенд: те же маршруты и формат ответов, что у настоящего ──
// Все данные в памяти (S), ничего не уходит по сети.

const USERS = {
  teacher: { tg: "900001", name: "Соколова Ирина", role: "Учитель", city: C1, staffId: 3, label: "Учитель" },
  zavuch: { tg: "900002", name: "Громова Елена", role: "Завуч", city: C1, staffId: 1, label: "Завуч" },
  admin: { tg: "900003", name: "Орлова Мария", role: "Администратор", city: C1, staffId: 2, label: "Админ" },
  director: { tg: "900004", name: "Алексеев Дмитрий", role: "Директор", city: "", staffId: 15, label: "Директор" },
  parent: { tg: "900005", name: "Родитель Демо", role: "Родитель", city: C1, staffId: null, label: "Родитель" },
};

const fmtMoney = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const weekdaysIn = (y, m) => { let n = 0; const last = new Date(y, m, 0).getDate(); for (let d = 1; d <= last; d++) { const w = new Date(y, m - 1, d).getDay(); if (w !== 0 && w !== 6) n++; } return n; };

function createApi(ctx) {
  // ctx: { S, user(), today, nowMin }
  const S = () => ctx.S;
  const ok = obj => ({ status: 200, body: Object.assign({ ok: true }, obj || {}) });
  const fail = (msg, status) => ({ status: status || 400, body: { ok: false, error: msg } });
  const scopeCity = () => { const u = ctx.user(); return u.role === "Директор" ? "" : (u.city || ""); };
  const todayDmy = () => fmtDmy(ctx.today);
  const staffById = id => S().staff.find(s => s.id === Number(id));
  const subjById = id => S().subjects.find(s => s.id === Number(id));
  const childById = id => S().children.find(c => c.id === Number(id));
  const hasSchedule = id => S().schedule.some(e => e.teacher_staff_id === id);
  const nid = () => S().nextId++;
  const dirty = () => { if (ctx.onChange) ctx.onChange(); };

  function childOut(c) {
    const links = S().links[c.id] || [];
    return Object.assign({}, c, {
      id: String(c.id),
      linked_telegrams: links.map(l => l.telegram_username).filter(Boolean),
      linked_all: links.map(l => Object.assign({}, l)),
    });
  }

  function resolveSid(city, cls, subjId, date, sid) {
    if (sid !== undefined && sid !== null && sid !== "") return Number(sid);
    const w = isoDow(parseDmy(date));
    const e = S().schedule.find(x => x.city === city && x.class_name === cls && x.subject_id === Number(subjId) && x.weekday === w);
    if (e) return e.id;
    const sub = S().subs.find(x => x.date === date && x.override_subject_id === Number(subjId) && (S().schedule.find(y => y.id === x.schedule_id) || {}).class_name === cls);
    return sub ? sub.schedule_id : 0;
  }
  const lkey = (sid, date) => sid + "|" + date;

  function scheduleOut(e) {
    const sub = e.subject_id ? subjById(e.subject_id) : null;
    const t = e.teacher_staff_id ? staffById(e.teacher_staff_id) : null;
    return Object.assign({}, e, { subject_name: sub ? sub.name : null, teacher_name: t ? t.name : null });
  }
  function subjectOut(s) { const t = s.teacher_staff_id ? staffById(s.teacher_staff_id) : null; return Object.assign({}, s, { teacher_name: t ? t.name : null }); }
  function gradeOut(g) {
    const c = childById(g.child_id), s = subjById(g.subject_id), t = g.teacher_staff_id ? staffById(g.teacher_staff_id) : null;
    return Object.assign({}, g, { child_name: c ? c.name : "", subject_name: s ? s.name : "", teacher_name: t ? t.name : null });
  }

  function lessonDone(sid, date) { const k = lkey(sid, date); return !!(S().topics[k] || (S().jatt[k] && Object.keys(S().jatt[k]).length)); }

  function teacherLessons(city, tid, date) {
    const w = isoDow(parseDmy(date));
    const subsToday = S().subs.filter(s => s.date === date);
    const out = [];
    S().schedule.filter(e => e.city === city && e.teacher_staff_id === tid && e.weekday === w && !e.is_break).forEach(e => {
      const s = subsToday.find(x => x.schedule_id === e.id);
      if (s && (s.no_lesson || s.teacher_staff_id !== tid)) return;
      const subj = subjById(e.subject_id);
      const eff = s && s.override_subject_id ? subjById(s.override_subject_id) : subj;
      out.push({ schedule_id: e.id, class_name: e.class_name, subject_id: eff.id, subject_name: eff.name, time_start: e.time_start, time_end: e.time_end, original_subject_id: subj.id, original_subject_name: subj.name, is_substitution: false, subject_overridden: eff.id !== subj.id });
    });
    subsToday.filter(s => s.teacher_staff_id === tid && !s.no_lesson).forEach(s => {
      const e = S().schedule.find(x => x.id === s.schedule_id);
      if (!e || e.city !== city || out.some(o => o.schedule_id === e.id)) return;
      const subj = subjById(e.subject_id);
      const eff = s.override_subject_id ? subjById(s.override_subject_id) : subj;
      out.push({ schedule_id: e.id, class_name: e.class_name, subject_id: eff.id, subject_name: eff.name, time_start: e.time_start, time_end: e.time_end, original_subject_id: subj.id, original_subject_name: subj.name, is_substitution: e.teacher_staff_id !== tid, subject_overridden: eff.id !== subj.id });
    });
    out.forEach(l => { l.done = lessonDone(l.schedule_id, date); });
    return out.sort((a, b) => a.time_start.localeCompare(b.time_start));
  }

  function lessonsTaughtMap(staffId, y, m) { return lessonsTaught(S(), staffId, y, m); }

  function calcSalary(st, y, m) {
    const att = S().payAtt[st.id] || {};
    const monthKey = d => { const x = parseDmy(d); return x.getFullYear() === y && x.getMonth() + 1 === m; };
    const present = Object.keys(att).filter(d => monthKey(d) && att[d].status === "present");
    const weekdays = weekdaysIn(y, m);
    const rate = Number(st.monthly_rate) || 0;
    const breakdown = [];
    let salary = 0;
    const subDays = present.filter(d => att[d].is_substitution);
    const normal = present.length - subDays.length;
    if (st.pay_type === "per_shift") {
      const subRate = 90000 / weekdays;
      salary = rate * normal + subRate * subDays.length;
      if (normal) breakdown.push({ label: "Обычные смены", text: normal + " × " + fmtMoney(rate) + " ₽ = " + fmtMoney(rate * normal) + " ₽" });
      if (subDays.length) breakdown.push({ label: "Дни замены воспитателя", text: subDays.length + " × " + fmtMoney(subRate) + " ₽ = " + fmtMoney(subRate * subDays.length) + " ₽", note: "ставка замены: 90 000 ₽ ÷ " + weekdays + " будних дней = " + fmtMoney(subRate) + " ₽/день" });
    } else if (st.pay_type === "monthly_fixed") {
      const day = weekdays ? rate / weekdays : 0;
      salary = day * normal + 1800 * subDays.length;
      if (normal) breakdown.push({ label: "Отработано", text: normal + " × " + fmtMoney(day) + " ₽ = " + fmtMoney(day * normal) + " ₽", note: "ставка в день: " + fmtMoney(rate) + " ₽ ÷ " + weekdays + " будних дней = " + fmtMoney(day) + " ₽/день" });
      if (subDays.length) breakdown.push({ label: "Дни замены (работал няней)", text: subDays.length + " × 1 800 ₽ = " + fmtMoney(1800 * subDays.length) + " ₽" });
    } else if (st.pay_type === "by_class_size" || st.pay_type === "by_student_count") {
      const classes = [...new Set(S().schedule.filter(e => e.city === st.city && e.teacher_staff_id === st.id && !e.is_break).map(e => e.class_name))];
      if (!classes.length) return { error: "Не удалось рассчитать ЗП по числу учеников: нет расписания в журнале" };
      let total = 0; const parts = [];
      classes.forEach(cn => {
        const n = S().children.filter(c => c.city === st.city && c.group === cn && c.status !== "Выбыл").length;
        const r = st.pay_type === "by_class_size" ? n * 4500 : n * 3500;
        total += r; parts.push(cn + " (" + n + " учен." + (st.pay_type === "by_class_size" ? " → " + fmtMoney(r) + " ₽" : "") + ")");
      });
      const day = weekdays ? total / weekdays : 0;
      salary = day * present.length;
      if (present.length) breakdown.push({ label: "Отработано", text: present.length + " × " + fmtMoney(day) + " ₽ = " + fmtMoney(day * present.length) + " ₽", note: "классы: " + parts.join(", ") + " = " + fmtMoney(total) + " ₽/мес ÷ " + weekdays + " будних дней = " + fmtMoney(day) + " ₽/день" });
    }
    let lessonsTotal = 0, extDays = 0;
    const lr = Number(st.lesson_rate) || 0, er = Number(st.extended_day_rate) || 0;
    if (lr || er) {
      if (hasSchedule(st.id)) {
        const mp = lessonsTaughtMap(st.id, y, m); lessonsTotal = Object.keys(mp).reduce((a, k) => a + mp[k], 0);
      } else {
        lessonsTotal = Object.keys(att).filter(monthKey).reduce((a, d) => a + (att[d].lessons_count || 0), 0);
      }
      extDays = Object.keys(att).filter(d => monthKey(d) && att[d].worked_extended_day).length;
      salary += lessonsTotal * lr + extDays * er;
      if (lessonsTotal) breakdown.push({ label: "Уроки", text: lessonsTotal + " × " + fmtMoney(lr) + " ₽ = " + fmtMoney(lessonsTotal * lr) + " ₽" });
      if (extDays) breakdown.push({ label: "Продлёнка", text: extDays + " × " + fmtMoney(er) + " ₽ = " + fmtMoney(extDays * er) + " ₽" });
    }
    const otRate = Number(st.overtime_rate) || 300;
    const ot = present.reduce((a, d) => a + (att[d].overtime_hours || 0), 0);
    if (ot) { salary += ot * otRate; breakdown.push({ label: "Переработка", text: ot + " ч × " + fmtMoney(otRate) + " ₽ = " + fmtMoney(ot * otRate) + " ₽" }); }
    if (!breakdown.length) breakdown.push({ label: "Нет отмеченных дней", text: "0 ₽" });
    breakdown.push({ label: "Итого", text: fmtMoney(salary) + " ₽", isTotal: true });
    return { staff_id: st.id, name: st.name, monthly_rate: rate, overtime_total: ot, weekdays_in_month: weekdays, present_days: present.length, lessons_total: lessonsTotal, extended_days_total: extDays, breakdown, salary: Math.round(salary) };
  }

  function csv(rows) { return "﻿" + rows.map(r => r.map(x => '"' + String(x == null ? "" : x).replace(/"/g, '""') + '"').join(";")).join("\n"); }
  function file(name, text) { return { status: 200, file: { name, text, type: "text/csv;charset=utf-8" } }; }

  function parentChild(Q) {
    const id = Number(Q.child_id);
    const c = childById(id);
    if (!c) return null;
    return c;
  }
  const parentOut = c => ({ id: c.id, name: c.name, dept: c.dept, group: c.group, city: c.city });

  function feedFor(c, subjectId) {
    const sidSet = S().schedule.filter(e => e.city === c.city && e.class_name === c.group).map(e => e.id);
    const dates = {};
    const put = (date, f, v) => { (dates[date] = dates[date] || { date, topic: null, homework: null, grades: [], attendance: null })[f] = v; };
    sidSet.forEach(sid => {
      const e = S().schedule.find(x => x.id === sid);
      if (e.subject_id !== Number(subjectId)) return;
    });
    Object.keys(S().topics).forEach(k => { const [sid, d] = k.split("|"); const e = S().schedule.find(x => x.id === Number(sid)); if (e && e.city === c.city && e.class_name === c.group && e.subject_id === Number(subjectId)) put(d, "topic", S().topics[k]); });
    Object.keys(S().homework).forEach(k => { const [sid, d] = k.split("|"); const e = S().schedule.find(x => x.id === Number(sid)); if (e && e.city === c.city && e.class_name === c.group && e.subject_id === Number(subjectId)) put(d, "homework", S().homework[k]); });
    Object.keys(S().jatt).forEach(k => { const [sid, d] = k.split("|"); const e = S().schedule.find(x => x.id === Number(sid)); if (e && e.city === c.city && e.class_name === c.group && e.subject_id === Number(subjectId) && S().jatt[k][c.id]) put(d, "attendance", S().jatt[k][c.id]); });
    S().grades.filter(g => g.child_id === c.id && g.subject_id === Number(subjectId)).forEach(g => {
      (dates[g.date] = dates[g.date] || { date: g.date, topic: null, homework: null, grades: [], attendance: null }).grades.push({ value: g.value, comment: g.comment || "" });
    });
    return Object.values(dates).sort((a, b) => parseDmy(b.date) - parseDmy(a.date)).slice(0, 30);
  }

  function route(method, rawPath, body) {
    const u = new URL(rawPath, "http://demo.local");
    const path = u.pathname.replace(/\/+$/, "") || "/";
    const Q = {}; u.searchParams.forEach((v, k) => { Q[k] = v; });
    body = body || {};
    const me = ctx.user();
    const sc = scopeCity();
    let m;

    if (path === "/health") return ok();

    // ── сотрудник ──
    if (path === "/staff" && method === "GET") {
      const own = me.staffId ? staffById(me.staffId) : null;
      return ok({ staff: {
        telegram_id: me.tg, name: me.name, city: me.city, role: me.role,
        payroll_staff_id: own ? own.id : null, pay_type: own ? own.pay_type : null, lesson_rate: own ? own.lesson_rate : null,
        extended_day_rate: own ? own.extended_day_rate : null, overtime_rate: own ? own.overtime_rate : null,
        is_journal_teacher: !!(own && hasSchedule(own.id)), pending_announcements: [],
      } });
    }
    if (path === "/staff/announcement-seen") return ok();

    // ── дети ──
    if (path === "/children" && method === "GET") {
      const archived = Q.archived === "true";
      const city = sc || Q.city || "";
      let list = S().children.filter(c => archived ? c.status === "Выбыл" : c.status !== "Выбыл");
      if (city) list = list.filter(c => c.city === city);
      if (Q.dept) list = list.filter(c => c.dept === Q.dept);
      return ok({ children: list.map(childOut) });
    }
    if (path === "/children" && method === "POST") {
      const c = Object.assign({ id: nid(), name: "", dob: "", city: sc || C1, dept: SAD, group: "", type: "", until: "", parent: "", telegram_id: "", allergy: "Нет", date_start: todayDmy(), cost: "", payment_date: "", payment_status: "Оплачено", status: "Активный" }, body);
      c.id = S().nextId - 1; S().children.push(c); dirty(); return ok();
    }
    if ((m = path.match(/^\/children\/(\d+)$/))) {
      const c = childById(m[1]);
      if (!c) return fail("not found", 404);
      if (method === "PUT") { Object.keys(body).forEach(k => { if (k !== "id") c[k] = body[k]; }); dirty(); return ok(); }
      if (method === "DELETE") { S().children = S().children.filter(x => x.id !== c.id); dirty(); return ok(); }
    }
    if ((m = path.match(/^\/children\/(\d+)\/parent-link$/)) && method === "POST") {
      const code = "DEMO" + m[1];
      return ok({ code, link: new URL("parent.html?code=" + code, ctx.baseUrl || "https://demo.local/").href });
    }
    if ((m = path.match(/^\/children\/(\d+)\/parent-link-auto$/)) && method === "POST") {
      const un = String(body.telegram || "").replace(/^@/, "");
      (S().links[m[1]] = S().links[m[1]] || []).push({ telegram_id: "8" + nid(), telegram_username: un, telegram_name: "", linked_at: todayDmy() });
      dirty(); return ok();
    }
    if ((m = path.match(/^\/children\/(\d+)\/parent-unlink$/)) && method === "POST") {
      const un = String(body.telegram || "").replace(/^@/, "").toLowerCase();
      S().links[m[1]] = (S().links[m[1]] || []).filter(l => body.telegram_id ? l.telegram_id !== String(body.telegram_id) : (l.telegram_username || "").toLowerCase() !== un);
      dirty(); return ok();
    }
    if ((m = path.match(/^\/children\/(\d+)\/diary-preview-token$/)) && method === "POST") return ok({ token: "demo-" + m[1] });

    // ── посещаемость сада ──
    if (path === "/attendance" && method === "GET") {
      const city = sc || Q.city || "";
      return ok({ records: S().attendance.filter(r => r.date === Q.date && (!city || r.city === city)).map(r => ({ date: r.date, city: r.city, dept: r.dept, group: r.group, name: r.name, status: r.status })) });
    }
    if (path === "/attendance" && method === "POST") {
      const recs = body.attendance || [];
      recs.forEach(r => {
        const i = S().attendance.findIndex(x => x.date === r.date && x.city === r.city && x.dept === r.dept && x.group === r.group && x.name === r.name);
        if (i >= 0) S().attendance[i] = Object.assign({}, S().attendance[i], r); else S().attendance.push(Object.assign({}, r));
      });
      dirty(); return ok({ saved: recs.length });
    }
    if (path === "/history" && method === "GET") {
      const now = ctx.today, cm = now.getMonth() + 1, cy = now.getFullYear();
      const pm = cm === 1 ? 12 : cm - 1, py = cm === 1 ? cy - 1 : cy;
      const res = { current: { present: 0, absent: 0, total: 0 }, prev: { present: 0, absent: 0, total: 0 }, days: {} };
      S().attendance.forEach(r => {
        if (r.name !== Q.name || r.city !== Q.city || (Q.dept && r.dept !== Q.dept) || (Q.group && r.group !== Q.group)) return;
        const d = parseDmy(r.date);
        res.days[r.date] = r.status;
        const bucket = (d.getMonth() + 1 === cm && d.getFullYear() === cy) ? res.current : (d.getMonth() + 1 === pm && d.getFullYear() === py) ? res.prev : null;
        if (bucket) { bucket[r.status === "present" ? "present" : "absent"]++; bucket.total++; }
      });
      return ok({ history: res });
    }
    if (path === "/trials" && method === "GET") {
      const city = sc || Q.city || "";
      return ok({ trials: S().trials.filter(t => !city || t.city === city).slice(-10) });
    }

    // ── заявки и лист ожидания ──
    if (path === "/bookings/active") {
      const city = sc || Q.city || "";
      const typeLabel = { "Заявка: пробное": "Пробное", "Пробное": "Пробное", "Школа": "Бронь", "Сад": "Бронь", "Ознакомление": "Ознакомление" };
      return ok({ bookings: S().bookings.filter(b => !city || b.city === city).map(b => Object.assign({}, b, { type: b.type, type_label: typeLabel[b.type] || b.type || "—" })) });
    }
    if (path === "/bookings/confirm" || path === "/bookings/reject" || path === "/bookings/waitlist" || path === "/bookings/message-client" || path === "/bookings/contact-status") {
      const b = S().bookings.find(x => x.row_num === Number(body.row_num));
      if (!b) return fail("not_found", 404);
      if (path.endsWith("confirm")) { b.status = "ПОДТВЕРЖДЕНО"; b.confirmed_date = b.wished_date || todayDmy(); S().trials.push({ parent_raw: b.parent + "|" + b.telegram, phone: b.phone, city: b.city, dept: b.dept, child_name: b.child_name, child_age: b.child_age, date: b.confirmed_date, notes: "", telegram_id: b.tg_id }); }
      if (path.endsWith("reject")) S().bookings = S().bookings.filter(x => x !== b);
      if (path.endsWith("/waitlist")) {
        S().bookings = S().bookings.filter(x => x !== b);
        S().waitlist.push({ id: nid(), created_at: todayDmy() + " 12:00", city: b.city, department: b.dept, group_name: "", child_name: b.child_name, child_age: b.child_age, parent_name: b.parent, phone: b.phone, telegram_id: b.tg_id, telegram_username: (b.telegram || "").replace(/^@/, ""), source: "бот", note: "" });
      }
      if (path.endsWith("contact-status")) b.contact_status = body.status;
      dirty(); return ok();
    }
    if (path === "/waitlist" && method === "GET") { const city = sc || Q.city || ""; return ok({ waitlist: S().waitlist.filter(w => !city || w.city === city) }); }
    if (path === "/waitlist/spot-free") return ok();
    if ((m = path.match(/^\/waitlist\/(\d+)$/)) && method === "DELETE") { S().waitlist = S().waitlist.filter(w => w.id !== Number(m[1])); dirty(); return ok(); }

    // ── зарплата и персонал ──
    if (path === "/payroll/staff" && method === "GET") {
      const archived = Q.archived === "true";
      const city = sc || Q.city || "";
      let list = S().staff.filter(s => archived ? !s.active : s.active);
      if (city) list = list.filter(s => s.city === city);
      if (me.role === "Завуч") return ok({ staff: list.map(s => ({ id: s.id, name: s.name, position: s.position, city: s.city })) });
      return ok({ staff: list.map(s => Object.assign({}, s, { is_journal_teacher: hasSchedule(s.id) })) });
    }
    if (path === "/payroll/staff" && method === "POST") {
      const st = Object.assign({ id: nid(), name: "", city: sc || C1, position: "", contract_end: "", phone: "", pay_type: "monthly_fixed", monthly_rate: null, active: true, telegram_id: "", lesson_rate: null, extended_day_rate: null, overtime_rate: null, work_start: "", work_end: "" }, body);
      st.id = S().nextId - 1; S().staff.push(st); S().payAtt[st.id] = {}; dirty(); return ok({ id: st.id });
    }
    if ((m = path.match(/^\/payroll\/staff\/(\d+)$/)) && method === "PUT") {
      const st = staffById(m[1]); if (!st) return fail("not found", 404);
      Object.keys(body).forEach(k => { if (k !== "id") st[k] = body[k]; }); dirty(); return ok();
    }
    if (path === "/payroll/attendance" && method === "GET") {
      const id = Number(Q.staff_id), y = Number(Q.year), mo = Number(Q.month);
      const att = S().payAtt[id] || {};
      const inMonth = d => { const x = parseDmy(d); return x.getFullYear() === y && x.getMonth() + 1 === mo; };
      const days = {}, subs = [], details = {}, ot = {};
      Object.keys(att).filter(inMonth).forEach(d => {
        const r = att[d]; days[d] = r.status;
        if (r.is_substitution) subs.push(d);
        if (r.lessons_count != null || r.worked_extended_day) details[d] = { lessons_count: r.lessons_count, worked_extended_day: !!r.worked_extended_day };
        if (r.overtime_hours > 0) ot[d] = r.overtime_hours;
      });
      if (hasSchedule(id)) { const mp = lessonsTaughtMap(id, y, mo); Object.keys(mp).forEach(d => { details[d] = { lessons_count: mp[d], worked_extended_day: false }; if (!days[d]) days[d] = "present"; }); }
      const scheduled = Object.keys(S().paySched).filter(d => inMonth(d) && S().paySched[d].includes(id));
      return ok({ days, substitutions: subs.sort(), lesson_details: details, overtime_hours: ot, scheduled: scheduled.sort() });
    }
    if (path === "/payroll/attendance" && method === "POST") {
      const id = body.staff_id ? Number(body.staff_id) : (me.staffId || 0);
      const att = (S().payAtt[id] = S().payAtt[id] || {});
      const prev = att[body.date] || { status: "absent", is_substitution: false, lessons_count: null, worked_extended_day: false, overtime_hours: 0 };
      att[body.date] = Object.assign({}, prev, { status: body.status || prev.status });
      ["is_substitution", "lessons_count", "worked_extended_day", "overtime_hours"].forEach(k => { if (body[k] !== undefined) att[body.date][k] = body[k]; });
      dirty(); return ok();
    }
    if (path === "/payroll/day") {
      const city = sc || Q.city || "";
      const out = [];
      S().staff.filter(s => s.active && (!city || s.city === city)).forEach(s => {
        const r = (S().payAtt[s.id] || {})[Q.date];
        if (r && r.status === "present") out.push({ id: s.id, name: s.name, city: s.city, position: s.position, pay_type: s.pay_type, overtime_rate: s.overtime_rate, is_substitution: !!r.is_substitution, lessons_count: r.lessons_count, worked_extended_day: !!r.worked_extended_day, overtime_hours: r.overtime_hours || 0 });
      });
      return ok({ staff: out });
    }
    if (path === "/payroll/schedule" && method === "GET") {
      const city = sc || Q.city || "";
      const ids = S().paySched[Q.date] || [];
      return ok({ staff: S().staff.filter(s => ids.includes(s.id) && s.active && (!city || s.city === city)).map(s => ({ id: s.id, name: s.name, city: s.city, position: s.position, pay_type: s.pay_type })) });
    }
    if (path === "/payroll/schedule" && method === "POST") { const a = (S().paySched[body.date] = S().paySched[body.date] || []); if (!a.includes(Number(body.staff_id))) a.push(Number(body.staff_id)); dirty(); return ok(); }
    if (path === "/payroll/schedule" && method === "DELETE") { S().paySched[body.date || Q.date] = (S().paySched[body.date || Q.date] || []).filter(x => x !== Number(body.staff_id || Q.staff_id)); dirty(); return ok(); }
    if (path === "/payroll/geofence-check") return ok({ in_range: true, distance_m: 12 });
    if (path === "/payroll/salary" && method === "GET") {
      const y = Number(Q.year), mo = Number(Q.month);
      if (Q.staff_id) { const st = staffById(Q.staff_id); if (!st) return fail("staff not found", 404); const r = calcSalary(st, y, mo); return r.error ? fail(r.error, 404) : ok({ salary: r }); }
      return ok({ salaries: S().staff.filter(s => s.active && (!sc || s.city === sc)).map(s => calcSalary(s, y, mo)) });
    }
    if (path === "/payroll/salary-summary") {
      const y = Number(Q.year), mo = Number(Q.month);
      const rows = []; let total = 0;
      S().staff.filter(s => s.active).forEach(s => { const r = calcSalary(s, y, mo); if (r.error) return; rows.push({ id: s.id, name: s.name, city: s.city, position: s.position, salary: r.salary }); total += r.salary; });
      return ok({ staff: rows, total });
    }

    // ── журнал ──
    if (path === "/journal/subjects") {
      if (method === "GET") return ok({ subjects: S().subjects.filter(s => s.city === Q.city && (!Q.class || s.class_name === Q.class)).sort((a, b) => (a.class_name + a.name).localeCompare(b.class_name + b.name, "ru")).map(subjectOut) });
      if (method === "POST") { const s = { id: nid(), city: body.city, class_name: body.class_name, name: body.name, teacher_staff_id: null }; S().subjects.push(s); dirty(); return ok({ id: s.id }); }
      if (method === "DELETE") { const id = Number(Q.id); S().subjects = S().subjects.filter(s => s.id !== id); S().schedule = S().schedule.filter(e => e.subject_id !== id); dirty(); return ok(); }
    }
    if ((m = path.match(/^\/journal\/subjects\/(\d+)$/)) && method === "PUT") {
      const s = subjById(m[1]); if (!s) return fail("not found", 404);
      if (body.name !== undefined) s.name = body.name;
      if (body.teacher_staff_id !== undefined) { s.teacher_staff_id = body.teacher_staff_id; S().schedule.filter(e => e.subject_id === s.id).forEach(e => { e.teacher_staff_id = body.teacher_staff_id; }); }
      dirty(); return ok();
    }
    if (path === "/journal/class-rename" && method === "POST") {
      S().children.forEach(c => { if (c.city === body.city && c.group === body.old_name) c.group = body.new_name; });
      [S().subjects, S().schedule, S().grades, S().periodGrades].forEach(arr => arr.forEach(x => { if (x.city === body.city && x.class_name === body.old_name) x.class_name = body.new_name; }));
      dirty(); return ok();
    }
    if (path === "/journal/schedule") {
      if (method === "GET") return ok({ schedule: S().schedule.filter(e => e.city === Q.city && (!Q.class || e.class_name === Q.class)).sort((a, b) => (a.class_name + a.weekday + a.time_start).localeCompare(b.class_name + b.weekday + b.time_start, "ru")).map(scheduleOut) });
      if (method === "POST") {
        const subj = body.subject_id ? subjById(body.subject_id) : null;
        const e = { id: nid(), city: body.city, class_name: body.class_name, weekday: Number(body.weekday), time_start: body.time_start || "", time_end: body.time_end || "", subject_id: body.subject_id ? Number(body.subject_id) : null, teacher_staff_id: body.teacher_staff_id !== undefined && body.teacher_staff_id !== null ? Number(body.teacher_staff_id) : (subj ? subj.teacher_staff_id : null), is_break: !!body.is_break, break_label: body.break_label || "" };
        S().schedule.push(e); dirty(); return ok({ id: e.id });
      }
      if (method === "DELETE") { const id = Number(Q.id); S().schedule = S().schedule.filter(e => e.id !== id); dirty(); return ok(); }
    }
    if ((m = path.match(/^\/journal\/schedule\/(\d+)$/)) && method === "PUT") {
      const e = S().schedule.find(x => x.id === Number(m[1])); if (!e) return fail("not found", 404);
      Object.keys(body).forEach(k => { if (k !== "id") e[k] = body[k]; }); dirty(); return ok();
    }
    if (path === "/journal/schedule-swap" && method === "POST") {
      const a = S().schedule.find(x => x.id === Number(body.a_id)), b = S().schedule.find(x => x.id === Number(body.b_id));
      if (!a || !b) return fail("not found", 404);
      ["weekday", "time_start", "time_end"].forEach(k => { const t = a[k]; a[k] = b[k]; b[k] = t; }); dirty(); return ok();
    }
    if (path === "/journal/substitutions" && method === "GET") {
      const subs = S().subs.filter(s => s.date === Q.date && (S().schedule.find(e => e.id === s.schedule_id) || {}).class_name === Q.class && (S().schedule.find(e => e.id === s.schedule_id) || {}).city === Q.city);
      const completed = [];
      S().schedule.filter(e => e.city === Q.city && e.class_name === Q.class && e.weekday === isoDow(parseDmy(Q.date)) && !e.is_break).forEach(e => { if (lessonDone(e.id, Q.date) && !completed.includes(e.subject_id)) completed.push(e.subject_id); });
      return ok({ substitutions: subs.map(s => { const t = s.teacher_staff_id ? staffById(s.teacher_staff_id) : null; const o = s.override_subject_id ? subjById(s.override_subject_id) : null; return { schedule_id: s.schedule_id, teacher_staff_id: s.teacher_staff_id, teacher_name: t ? t.name : null, external: !!s.external, no_lesson: !!s.no_lesson, override_subject_id: s.override_subject_id || null, override_subject_name: o ? o.name : null }; }), completed: completed.sort() });
    }
    if (path === "/journal/substitutions" && method === "POST") {
      const sid = Number(body.schedule_id);
      S().subs = S().subs.filter(s => !(s.schedule_id === sid && s.date === body.date));
      const t = body.teacher_staff_id !== undefined && body.teacher_staff_id !== null ? Number(body.teacher_staff_id) : null;
      if (t || body.external || body.no_lesson) S().subs.push({ schedule_id: sid, date: body.date, teacher_staff_id: t, external: !!body.external, no_lesson: !!body.no_lesson, override_subject_id: body.override_subject_id ? Number(body.override_subject_id) : null });
      dirty(); return ok();
    }
    if (path === "/journal/my-today") {
      let tid, city;
      if (Q.staff_id) { tid = Number(Q.staff_id); city = Q.city || me.city || C1; }
      else { tid = me.staffId; city = me.city || ""; }
      if (!tid || !city) return ok({ lessons: [] });
      return ok({ lessons: teacherLessons(city, tid, Q.date) });
    }
    if (path === "/journal/my-subjects") {
      const tid = Q.teacher_staff_id ? Number(Q.teacher_staff_id) : me.staffId;
      const t = tid ? staffById(tid) : null;
      if (!t) return ok({ subjects: [] });
      const seen = new Set(), out = [];
      S().schedule.filter(e => e.city === t.city && e.teacher_staff_id === tid && !e.is_break).sort((a, b) => (a.class_name + a.weekday + a.time_start).localeCompare(b.class_name + b.weekday + b.time_start, "ru")).forEach(e => {
        const k = e.class_name + "|" + e.subject_id; if (seen.has(k)) return; seen.add(k);
        out.push({ city: t.city, class_name: e.class_name, subject_id: e.subject_id, subject_name: subjById(e.subject_id).name });
      });
      S().subs.filter(s => s.teacher_staff_id === tid && !s.no_lesson && parseDmy(s.date) >= ctx.today).forEach(s => {
        const e = S().schedule.find(x => x.id === s.schedule_id); if (!e) return;
        const sid = s.override_subject_id || e.subject_id; const k = e.class_name + "|" + sid; if (seen.has(k)) return; seen.add(k);
        out.push({ city: t.city, class_name: e.class_name, subject_id: sid, subject_name: subjById(sid).name, via_substitution: true });
      });
      return ok({ subjects: out });
    }
    if (path === "/journal/grades" && method === "GET") {
      let list = S().grades.filter(g => g.city === Q.city && (!Q.class || g.class_name === Q.class) && (!Q.subject_id || g.subject_id === Number(Q.subject_id)) && (!Q.child_id || g.child_id === Number(Q.child_id)) && (!Q.schedule_id || g.schedule_id === Number(Q.schedule_id)));
      if (Q.date_from) list = list.filter(g => parseDmy(g.date) >= parseDmy(Q.date_from));
      if (Q.date_to) list = list.filter(g => parseDmy(g.date) <= parseDmy(Q.date_to));
      list.sort((a, b) => parseDmy(a.date) - parseDmy(b.date));
      return ok({ grades: list.map(gradeOut) });
    }
    if (path === "/journal/grades" && method === "POST") {
      if (!(body.city && body.class_name && body.child_id && body.subject_id && body.date && body.value)) return fail("city, class_name, child_id, subject_id, date, value required");
      const g = { id: nid(), city: body.city, class_name: body.class_name, child_id: Number(body.child_id), subject_id: Number(body.subject_id), date: body.date, value: String(body.value), grade_type: body.grade_type || "Урок", comment: body.comment || "", teacher_staff_id: me.staffId || body.teacher_staff_id || null, schedule_id: body.schedule_id !== undefined && body.schedule_id !== null ? Number(body.schedule_id) : null };
      S().grades.push(g); dirty(); return ok({ id: g.id });
    }
    if ((m = path.match(/^\/journal\/grades\/(\d+)$/)) && method === "PUT") {
      const g = S().grades.find(x => x.id === Number(m[1])); if (!g) return fail("not found", 404);
      ["value", "comment", "grade_type"].forEach(k => { if (body[k] !== undefined) g[k] = body[k]; }); dirty(); return ok();
    }
    if (path === "/journal/grades" && method === "DELETE") { S().grades = S().grades.filter(g => g.id !== Number(Q.id)); dirty(); return ok(); }
    if (path === "/journal/lesson-topic" && method === "GET") {
      const k = lkey(resolveSid(Q.city, Q.class, Q.subject_id, Q.date, Q.schedule_id), Q.date);
      return ok({ topic: S().topics[k] !== undefined ? { id: 1, topic: S().topics[k] } : null });
    }
    if (path === "/journal/lesson-topic" && method === "POST") {
      const k = lkey(resolveSid(body.city, body.class_name, body.subject_id, body.date, body.schedule_id), body.date);
      if (!String(body.topic || "").trim()) delete S().topics[k]; else S().topics[k] = String(body.topic);
      dirty(); return ok();
    }
    if (path === "/journal/homework" && method === "GET") {
      const k = lkey(resolveSid(Q.city, Q.class, Q.subject_id, Q.date, Q.schedule_id), Q.date);
      return ok({ homework: S().homework[k] !== undefined ? { id: 1, text: S().homework[k] } : null });
    }
    if (path === "/journal/homework" && method === "POST") {
      const k = lkey(resolveSid(body.city, body.class_name, body.subject_id, body.date, body.schedule_id), body.date);
      if (!String(body.text || "").trim()) delete S().homework[k]; else S().homework[k] = String(body.text);
      dirty(); return ok();
    }
    if (path === "/journal/lesson/clear" && method === "POST") {
      const k = lkey(resolveSid(body.city, body.class_name, body.subject_id, body.date, body.schedule_id), body.date);
      delete S().topics[k]; delete S().homework[k]; delete S().jatt[k]; dirty(); return ok();
    }
    if (path === "/journal/attendance" && method === "GET") {
      const k = lkey(resolveSid(Q.city, Q.class, Q.subject_id, Q.date, Q.schedule_id), Q.date);
      const a = S().jatt[k] || {};
      return ok({ attendance: Object.keys(a).map(id => ({ child_id: Number(id), status: a[id] })) });
    }
    if (path === "/journal/attendance" && method === "POST") {
      const k = lkey(resolveSid(body.city, body.class_name, body.subject_id, body.date, body.schedule_id), body.date);
      const a = (S().jatt[k] = S().jatt[k] || {});
      let recs = body.records || [];
      if (!Array.isArray(recs)) recs = Object.values(recs);
      if (body.child_id !== undefined && body.status !== undefined) recs = recs.concat([{ child_id: body.child_id, status: body.status }]);
      recs.forEach(r => { a[r.child_id] = r.status; });
      dirty(); return ok();
    }
    if (path === "/journal/subject-history") {
      const sid = Number(Q.subject_id);
      const ids = new Set(S().schedule.filter(e => e.city === Q.city && e.class_name === Q.class).map(e => e.id));
      const keys = new Set();
      [S().topics, S().homework].forEach(o => Object.keys(o).forEach(k => { const [s, d] = k.split("|"); const e = S().schedule.find(x => x.id === Number(s)); if (e && ids.has(e.id) && e.subject_id === sid) keys.add(k); }));
      const gc = {};
      S().grades.filter(g => g.city === Q.city && g.class_name === Q.class && g.subject_id === sid).forEach(g => { const k = (g.schedule_id || 0) + "|" + g.date; gc[k] = (gc[k] || 0) + 1; keys.add(k); });
      const hist = [...keys].map(k => { const [s, d] = k.split("|"); return { date: d, schedule_id: Number(s) || null, topic: S().topics[k] !== undefined ? S().topics[k] : null, homework: S().homework[k] !== undefined ? S().homework[k] : null, grade_count: gc[k] || 0 }; })
        .sort((a, b) => parseDmy(b.date) - parseDmy(a.date) || (b.schedule_id || 0) - (a.schedule_id || 0)).slice(0, 30);
      return ok({ history: hist });
    }
    if (path === "/journal/period-grades" && method === "GET") {
      const list = S().periodGrades.filter(g => g.city === Q.city && (!Q.class || g.class_name === Q.class) && (!Q.child_id || g.child_id === Number(Q.child_id)) && (!Q.subject_id || g.subject_id === Number(Q.subject_id)) && (!Q.period || g.period === Q.period));
      return ok({ grades: list.map(g => { const c = childById(g.child_id), s = subjById(g.subject_id), t = g.teacher_staff_id ? staffById(g.teacher_staff_id) : null; return Object.assign({}, g, { child_name: c ? c.name : "", subject_name: s ? s.name : "", teacher_name: t ? t.name : null }); }) });
    }
    if (path === "/journal/period-grades" && method === "POST") {
      let g = S().periodGrades.find(x => x.city === body.city && x.child_id === Number(body.child_id) && x.subject_id === Number(body.subject_id) && x.period === body.period);
      if (g) g.value = String(body.value); else S().periodGrades.push({ id: nid(), city: body.city, class_name: body.class_name, child_id: Number(body.child_id), subject_id: Number(body.subject_id), period: body.period, value: String(body.value), teacher_staff_id: me.staffId || body.teacher_staff_id || null });
      dirty(); return ok();
    }
    if (path === "/journal/period-grades" && method === "DELETE") { S().periodGrades = S().periodGrades.filter(g => g.id !== Number(Q.id)); dirty(); return ok(); }
    if (path === "/journal/grade-sheet") {
      const kids = S().children.filter(c => c.city === Q.city && c.group === Q.class && c.status !== "Выбыл");
      const sub = subjById(Q.subject_id);
      const rows = [["Ученик", "Оценки", "Средний балл"]];
      kids.forEach(k => {
        let gs = S().grades.filter(g => g.child_id === k.id && g.subject_id === Number(Q.subject_id));
        if (Q.date_from) gs = gs.filter(g => parseDmy(g.date) >= parseDmy(Q.date_from));
        if (Q.date_to) gs = gs.filter(g => parseDmy(g.date) <= parseDmy(Q.date_to));
        const avg = gs.length ? (gs.reduce((a, g) => a + parseInt(g.value, 10), 0) / gs.length).toFixed(2).replace(".", ",") : "";
        rows.push([k.name, gs.map(g => g.date + ": " + g.value).join("; "), avg]);
      });
      return file("Ведомость " + (sub ? sub.name : "") + ".csv", csv(rows));
    }
    if (path === "/journal/report-card" || path === "/journal/child-grades") {
      const c = childById(Q.child_id); if (!c) return fail("not found", 404);
      const rows = [["Предмет", "Оценки", "Средний балл"]];
      S().subjects.filter(s => s.city === c.city && s.class_name === c.group).forEach(s => {
        const gs = S().grades.filter(g => g.child_id === c.id && g.subject_id === s.id);
        rows.push([s.name, gs.map(g => g.date + ": " + g.value).join("; "), gs.length ? (gs.reduce((a, g) => a + parseInt(g.value, 10), 0) / gs.length).toFixed(2).replace(".", ",") : ""]);
      });
      return file((path.endsWith("report-card") ? "Ведомость " : "Оценки ") + c.name + ".csv", csv(rows));
    }

    // ── родитель ──
    if (path === "/parent/children") return ok({ children: S().parentChildIds.map(id => parentOut(childById(id))).filter(Boolean) });
    if (path === "/parent/preview-child") {
      const id = Number(String(Q.preview_token || "").replace("demo-", "")); const c = childById(id);
      return c ? ok({ child: parentOut(c) }) : fail("not found", 404);
    }
    if (path === "/parent/schedule") { const c = parentChild(Q); return c ? ok({ schedule: S().schedule.filter(e => e.city === c.city && e.class_name === c.group).map(scheduleOut) }) : fail("not found", 404); }
    if (path === "/parent/subjects") { const c = parentChild(Q); return c ? ok({ subjects: S().subjects.filter(s => s.city === c.city && s.class_name === c.group).map(subjectOut) }) : fail("not found", 404); }
    if (path === "/parent/subject-feed") { const c = parentChild(Q); return c ? ok({ feed: feedFor(c, Q.subject_id) }) : fail("not found", 404); }
    if (path === "/parent/period-grades") {
      const c = parentChild(Q); if (!c) return fail("not found", 404);
      return ok({ grades: S().periodGrades.filter(g => g.child_id === c.id && (!Q.subject_id || g.subject_id === Number(Q.subject_id)) && (!Q.period || g.period === Q.period)).map(gradeOut) });
    }

    return fail("not found: " + method + " " + path, 404);
  }

  return { route, calcSalary, teacherLessons, childOut };
}

// ── Браузерная обвязка: подмена Telegram, fetch, часов и переключатель ролей ──
const API_HOST = "https://api.demo.local";
const API_HOST_BACKUP = "https://api-backup.demo.local";
const STATE_KEY = "demo_state_v1";
const ROLE_KEY = "demo_role";
const PANEL_KEY = "demo_panel_open";

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

function installClock(win, real) {
  const demo = pickDemoDate(real);
  const mid = new Date(real.getFullYear(), real.getMonth(), real.getDate());
  const shift = Math.round((demo.getTime() - mid.getTime()) / 86400000);
  if (!shift) return demo;
  const RD = win.Date;
  const nowShifted = () => { const d = new RD(); d.setDate(d.getDate() + shift); return d.getTime(); };
  win.Date = new Proxy(RD, {
    construct(t, args, nt) { if (args.length === 0) return new t(nowShifted()); return Reflect.construct(t, args, nt); },
    apply() { return new RD(nowShifted()).toString(); },
    get(t, p, r) { if (p === "now") return nowShifted; return Reflect.get(t, p, t); },
  });
  return demo;
}

function pageKind(win) {
  const p = (win.location.pathname || "").toLowerCase();
  if (p.endsWith("/parent.html")) return "parent";
  if (p.endsWith("/bookings.html")) return "bookings";
  return "index";
}

function pickRole(page) {
  let r = lsGet(ROLE_KEY);
  if (!USERS[r]) r = "teacher";
  if (page === "parent") return "parent";
  if (page === "bookings" && r !== "admin" && r !== "director") return "admin";
  return r;
}

function browserInit(win) {
  // Открыто на компьютере отдельной вкладкой: показываем в рамке телефона (внутри iframe рамка не нужна).
  if (win.top === win && win.innerWidth > 700) {
    const file = (win.location.pathname.split("/").pop() || "index.html") + (win.location.search || "");
    win.location.replace("phone.html?src=" + encodeURIComponent(file));
    return;
  }
  const real = new Date();
  const today = installClock(win, real);
  const nowMin = real.getHours() * 60 + real.getMinutes();
  const page = pageKind(win);
  const role = pickRole(page);
  if (page === "index" && lsGet(ROLE_KEY) === "parent") { win.location.replace("parent.html"); return; }

  let S = null;
  try { const raw = lsGet(STATE_KEY); if (raw) { const s = JSON.parse(raw); if (s && s.v === 1 && s.seedDay === fmtDmy(today)) S = s; } } catch (e) {}
  if (!S) S = seedState(today, nowMin);
  let timer = null;
  const save = () => { clearTimeout(timer); timer = setTimeout(() => { try { lsSet(STATE_KEY, JSON.stringify(ctx.S)); } catch (e) {} }, 300); };
  const ctx = { S, today, nowMin, user: () => USERS[role], onChange: save, baseUrl: win.location.href };
  const api = createApi(ctx);
  save();

  // fetch: все запросы к «серверу» отвечает api.route, остальное — как обычно.
  const nativeFetch = win.fetch ? win.fetch.bind(win) : null;
  win.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : (input && input.url) || "";
    if (url.startsWith(API_HOST) || url.startsWith(API_HOST_BACKUP)) {
      const path = url.slice(url.startsWith(API_HOST) ? API_HOST.length : API_HOST_BACKUP.length);
      const method = ((init && init.method) || "GET").toUpperCase();
      let body = null;
      if (init && init.body) { try { body = JSON.parse(init.body); } catch (e) { body = null; } }
      await new Promise(r => setTimeout(r, 30 + Math.random() * 70));
      let r;
      try { r = api.route(method, path, body); } catch (e) { console.error("demo api error:", method, path, e); r = { status: 500, body: { ok: false, error: "demo error" } }; }
      if (r.file) return new Response(new Blob([r.file.text], { type: r.file.type }), { status: 200 });
      return new Response(JSON.stringify(r.body), { status: r.status || 200, headers: { "Content-Type": "application/json" } });
    }
    return nativeFetch ? nativeFetch(input, init) : Promise.reject(new Error("no fetch"));
  };

  // Геолокация: всегда «на месте», без запроса разрешения.
  try {
    Object.defineProperty(win.navigator, "geolocation", { configurable: true, value: {
      getCurrentPosition(ok) { setTimeout(() => ok({ coords: { latitude: 55.75, longitude: 37.61, accuracy: 10 }, timestamp: Date.now() }), 50); },
      watchPosition() { return 0; }, clearWatch() {},
    } });
  } catch (e) {}

  // Telegram.WebApp
  const u = USERS[role];
  const saveBlob = (name, text, type) => {
    const a = win.document.createElement("a");
    a.href = win.URL.createObjectURL(new Blob([text], { type }));
    a.download = name; win.document.body.appendChild(a); a.click(); a.remove();
  };
  win.Telegram = { WebApp: {
    initData: "demo", initDataUnsafe: { user: { id: Number(u.tg), first_name: u.name.split(" ")[1] || u.name, last_name: u.name.split(" ")[0] || "" } },
    platform: "demo", version: "8.0", colorScheme: "dark", themeParams: {}, isExpanded: true,
    ready() {}, expand() {}, close() {}, requestFullscreen() {}, setHeaderColor() {}, setBackgroundColor() {}, enableClosingConfirmation() {},
    onEvent() {}, offEvent() {}, sendData() {},
    openLink(url) { try { win.open(url, "_blank", "noopener"); } catch (e) {} },
    openTelegramLink() {},
    showAlert(msg, cb) { win.alert(msg); if (cb) cb(); },
    showConfirm(msg, cb) { const r = win.confirm(msg); if (cb) cb(r); },
    HapticFeedback: { impactOccurred() {}, notificationOccurred() {}, selectionChanged() {} },
    downloadFile(opts, cb) {
      try {
        const rel = String(opts.url).replace(API_HOST, "").replace(/([?&])init_data=[^&]*/, "").replace(/\?&/, "?").replace(/[?&]$/, "");
        const r = api.route("GET", rel, null);
        if (r.file) saveBlob(r.file.name, r.file.text, r.file.type);
        if (cb) cb(true);
      } catch (e) { if (cb) cb(false); }
    },
  } };

  win.__demo = { role, today: fmtDmy(today), reset() { lsDel(STATE_KEY); win.location.reload(); } };
  win.addEventListener("DOMContentLoaded", () => mountSwitcher(win, page, role));
  if (win.document.readyState !== "loading") mountSwitcher(win, page, role);
}

function mountSwitcher(win, page, role) {
  const doc = win.document;
  if (doc.getElementById("demoSwitcher")) return;
  const wrap = doc.createElement("div");
  wrap.id = "demoSwitcher";
  const open0 = lsGet(PANEL_KEY) === "1";
  const base = "font-family:'Geologica',system-ui,sans-serif;box-sizing:border-box;";
  wrap.style.cssText = base + "position:fixed;top:8px;right:8px;z-index:2147483000;max-width:230px;color:#fff;";
  const chipStyle = base + "display:flex;align-items:center;gap:6px;background:rgba(20,22,30,.92);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:5px 11px;font-size:11.5px;font-weight:600;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35);";
  const btnStyle = (on) => base + "display:block;width:100%;text-align:left;border:0;border-radius:9px;padding:8px 10px;margin:0 0 5px;font-size:12.5px;font-weight:600;cursor:pointer;color:#fff;background:" + (on ? "#4f8ef7" : "rgba(255,255,255,.1)") + ";";
  function render() {
    const open = lsGet(PANEL_KEY) === "1";
    if (!open) {
      wrap.innerHTML = '<div id="demoChip" style="' + chipStyle + '"><span style="opacity:.7">Роль:</span><span>' + USERS[role].label + '</span><span style="opacity:.6">▾</span></div>';
      wrap.querySelector("#demoChip").onclick = () => { lsSet(PANEL_KEY, "1"); render(); };
      return;
    }
    const roles = Object.keys(USERS).map(k => '<button data-role="' + k + '" style="' + btnStyle(k === role) + '">' + USERS[k].label + '</button>').join("");
    const extra = (role === "admin" || role === "director") && page !== "bookings" ? '<a href="bookings.html" style="' + btnStyle(false) + 'text-decoration:none">Заявки и лист ожидания</a>' : (page === "bookings" ? '<a href="index.html" style="' + btnStyle(false) + 'text-decoration:none">← К приложению</a>' : "");
    wrap.innerHTML = '<div style="' + base + 'background:rgba(20,22,30,.96);border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:10px;box-shadow:0 6px 24px rgba(0,0,0,.45);">' +
      '<div style="font-size:11px;opacity:.65;margin:0 2px 8px">Демо-режим · данные выдуманные</div>' + roles + extra +
      '<button id="demoReset" style="' + btnStyle(false) + 'background:rgba(255,107,107,.22)">Сбросить демо</button>' +
      '<button id="demoHide" style="' + btnStyle(false) + 'margin-bottom:0;text-align:center;opacity:.8">Свернуть</button></div>';
    wrap.querySelectorAll("button[data-role]").forEach(b => { b.onclick = () => { lsSet(ROLE_KEY, b.getAttribute("data-role")); win.location.href = b.getAttribute("data-role") === "parent" ? "parent.html" : "index.html"; }; });
    wrap.querySelector("#demoReset").onclick = () => { lsDel(STATE_KEY); win.location.reload(); };
    wrap.querySelector("#demoHide").onclick = () => { lsSet(PANEL_KEY, "0"); render(); };
  }
  render();
  doc.body.appendChild(wrap);
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  browserInit(window);
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { seedState, createApi, USERS, pickDemoDate, isSchoolDay, fmtDmy, parseDmy, C1, C2, SAD, SCH, lessonsTaught };
}

})();
