'use strict';
const $ = s => document.querySelector(s);
const KEY = 'attic-goals-v1';

// ---- Content ---------------------------------------------------------
const BASE_POINTS = { todo: 5, daily: 5, weekly: 15, habit: 3 };
const TYPE_LABEL = { daily: 'Daily goals', weekly: 'Weekly goals', habit: 'Habits', todo: 'To-dos' };

// Affinity grows with every heart you have ever earned.
const LEVELS = [0, 15, 40, 80, 140, 220, 320, 450];

// Each upgrade changes the room (or the house) and unlocks a little story.
//   line  - the first thing your friend says when you do it   more - the rest of that scene
//   chat  - extra things they say later, when you tap them while that upgrade is in the room
//   memory- the entry that is written into the journal
//   req   - another upgrade that has to be done first         short - how a lock label names it
// Downstairs upgrades all need the stairs, which are hidden under the attic boxes.
const UPGRADES = [
  { id: 'boxes', place: 'Attic', lvl: 1, name: 'Clear the boxes', cost: 15, short: 'boxes',
    line: "Those boxes were in the way for years. I couldn't move them alone.",
    more: ["(surprised) ...Wait. There's something in the floor under where they were. A hatch."],
    chat: ["It's nice to see the floor again.", "I keep looking at that spot where the boxes were."],
    memory: "The boxes are gone. There was a hatch in the floor under them." },
  { id: 'web', place: 'Attic', lvl: 1, name: 'Sweep the cobwebs', cost: 10,
    line: "You cleaned the cobwebs... I'd stopped noticing them.",
    chat: ["I think the spider moved out. I hope it found somewhere nice."],
    memory: "The cobwebs are gone. I'd stopped noticing them." },
  { id: 'dust', place: 'Attic', lvl: 1, name: 'Dust the floor', cost: 20,
    line: "It's easier to breathe in here now.",
    chat: ["I used to sneeze a lot. I don't, now."],
    memory: "The dust is gone. It's easier to breathe." },
  { id: 'grime', place: 'Attic', lvl: 2, name: 'Wash the window', cost: 35,
    line: "Oh. I forgot the window was see-through. The rain looks kind of nice.",
    chat: ["I like watching the raindrops race down the glass.", "Seven drops. That one won."],
    memory: "The window is clean. The rain looks kind of nice." },
  { id: 'lamp', place: 'Attic', lvl: 2, name: 'Light the lamp', cost: 50,
    line: "It's warm. I haven't had a light on in a long time.",
    chat: ["The lamp hums, very quietly. I think it's happy too."],
    memory: "The lamp is lit. It's warm." },
  { id: 'rug', place: 'Attic', lvl: 2, name: 'Lay down a rug', cost: 70,
    line: "My feet aren't cold anymore. Funny, the little things.",
    chat: ["The rug is softer than it looks."],
    memory: "A rug on the floor. My feet aren't cold anymore." },
  { id: 'shelf', place: 'Attic', lvl: 3, name: 'Put up a bookshelf', cost: 100,
    line: "I used to read a lot. Maybe I'll start again.",
    chat: ["I picked a book. I've read the first page three times.", "The books smell like old rain."],
    memory: "A bookshelf. I used to read a lot." },
  { id: 'plant', place: 'Attic', lvl: 3, name: 'Bring in a plant', cost: 140,
    line: "Do you think it'll grow if I talk to it?",
    chat: ["Nothing yet. But it feels like it's listening."],
    memory: "A plant on the shelf. I talk to it, just in case." },
  { id: 'tea', place: 'Attic', lvl: 3, name: 'Set up a tea table', cost: 190,
    line: "Stay for tea? You've earned it. I mean that.",
    chat: ["Chamomile, I think. Or maybe just warm water. It's the thought that counts."],
    memory: "A tea table. You stayed for tea." },
  { id: 'stairs', place: 'Attic', lvl: 3, req: 'boxes', name: 'Mend the stairs', cost: 80, short: 'stairs',
    line: "That hatch leads down into the rest of the house. I haven't been down since the rain started.",
    more: ["The third step creaks. ...You fixed it. Even the handrail.",
           "(neutral) Will you come with me? Tap the hatch, or use the arrow at the top."],
    chat: ["I keep looking at the hatch. It's strange, having somewhere else to go.", "The stairs creak. I like the sound, a little."],
    memory: "The stairs are mended. There's a whole house down there." },

  // ---- Downstairs ---------------------------------------------------
  { id: 'sheets', place: 'Downstairs', lvl: 3, req: 'stairs', name: 'Pull off the dust sheets', cost: 50, short: 'sheets off',
    line: "That's the sofa. I'd forgotten it was blue.",
    more: ["I used to sit here every evening. Rain on the roof, a blanket, a book.", "(sad) Someone always had the blanket. ...Sorry. Keep going. I'm fine."],
    chat: ["It smells like old paper and dust down here. I don't mind.", "The sofa's lumpy. It's still the best seat in the house."],
    memory: "Under the sheets, a sofa that was once blue. I used to sit there every evening." },
  { id: 'kitchen', place: 'Downstairs', lvl: 3, req: 'stairs', name: 'Fix up the kitchen', cost: 120, short: 'kitchen',
    line: "The stove still works. I'm surprised.",
    more: ["I used to make soup. Too much of it, always. Someone had to help me eat it.", "(happy) Maybe we can make some together. When you're ready."],
    chat: ["I should make soup. Do you like soup?", "The kettle whistles at me when I ignore it. It's very clingy."],
    memory: "The kitchen works again. I used to make far too much soup." },
  { id: 'purifier', place: 'Downstairs', lvl: 4, req: 'kitchen', name: 'Water purifier', cost: 150,
    line: "Clean water from the rain. Never thought of that.",
    more: ["All those years it fell and I never caught a single drop.", "(happy) Maybe the rain isn't only sad. It's useful too."],
    chat: ["The crock goes 'plink' when it's full. It's very soothing.", "Do you think rain tastes different in different places?"],
    memory: "A water purifier. The rain is good for something, after all." },
  { id: 'fern', place: 'Downstairs', lvl: 4, req: 'stairs', name: 'Fern by the stairs', cost: 160,
    line: "It's greener down here than I remembered.",
    more: ["This fern was tiny. Someone gave it to me and I said I'd kill it.", "I did water it. Sometimes. ...Look how big it got anyway."],
    chat: ["The fern leans toward the stairs. Toward the light, I think.", "I talk to the fern when you're away. Don't tell it I said so."],
    memory: "The fern at the foot of the stairs. It grew anyway." },
  { id: 'throw', place: 'Downstairs', lvl: 4, req: 'sheets', name: 'Fold a blanket over the sofa', cost: 70,
    line: "That blanket was in the cupboard under the stairs the whole time.",
    more: ["It smells like... home, I think. Is that a smell?", "(happy) Sit with me? There's room."],
    chat: ["A blanket is just a hug you can leave on the sofa.", "The stripes are mustard. I always liked the mustard."],
    memory: "A striped blanket from the cupboard under the stairs." },
  { id: 'clock', place: 'Downstairs', lvl: 4, req: 'stairs', name: 'Wind the old clock', cost: 90,
    line: "It's ticking again.",
    more: ["It stopped the day the rain started. I never wound it. I think I didn't want to know how long it had been.",
           "...It's been a while. But it's ticking now. That's what matters."],
    chat: ["Tick, tock. I count the swings sometimes. It's a good way to fall asleep.", "The clock runs a little slow. I like that. Time can take its time."],
    memory: "The old clock ticks again. It had stopped the day the rain started." },
  { id: 'fireplace', place: 'Downstairs', lvl: 5, req: 'sheets', name: 'Light the fireplace', cost: 150,
    line: "...Oh.",
    more: ["(surprised) A fire. There's a fire in the house again.", "I'd stopped imagining I could be warm. Thank you. Really.", "(happy) Come and sit. Let's just watch it for a while."],
    chat: ["A fire sounds like rain, if you squint with your ears.", "I fall asleep to the crackle. Don't tell the rain."],
    memory: "A fire in the fireplace. I'd stopped imagining I could be warm." },
  { id: 'photos', place: 'Downstairs', lvl: 5, req: 'sheets', name: 'Hang up the photographs', cost: 110,
    line: "You found the photographs.",
    more: ["That's the park. That's the bench by the lamppost. And that's the house, in the rain. My favourite places.",
           "I haven't looked at them in so long. I thought it would hurt. It mostly just... glows."],
    chat: ["Look at that bench. We could go there. Someday.", "I think I'm smiling in that one. My mouth is small, so it's hard to tell."],
    memory: "The photographs are back on the wall. The park, the bench, the house in the rain." },
  { id: 'door', place: 'Downstairs', lvl: 6, req: 'stairs', name: 'Oil the front door', cost: 160, short: 'door',
    line: "The front door. It's been stuck since the first big storm.",
    more: ["I always meant to oil the hinges. Then I stopped meaning to do anything.",
           "(surprised) It opens. ...It actually opens. There's light out there, even if it's grey.",
           "I'm not ready to go out alone. But with you...? Maybe. (Outings are open now.)"],
    chat: ["I can hear the street through the gap. It's quiet. A nice sort of quiet.", "There's a mat now. I feel like I should say welcome to everyone."],
    memory: "The front door opens again. We can go outside." },
  { id: 'umbrella', place: 'Downstairs', lvl: 7, req: 'door', name: 'A second umbrella', cost: 80,
    line: "Two umbrellas. I always kept two by the door.",
    more: ["One for me. One for whoever came by.", "(happy) ...I think the yellow one is yours now."],
    chat: ["The yellow one is yours. I just wanted you to know it's there."],
    memory: "Two umbrellas by the door. One for me, and the yellow one is yours." },
];
const UPG = id => UPGRADES.find(u => u.id === id);

const OUTINGS = [
  { id: 'park', name: 'Walk in the park', cost: 15, lvl: 6, req: 'door', finds: ['Four-leaf clover', 'Flea-market teacup', 'Night-market lantern', 'Forest leaf'] },
  { id: 'city', name: 'Walk in the city', cost: 15, lvl: 6, req: 'door', finds: ['Alley cat photo', 'Bus ticket', 'Beach shell', 'Shop receipt'] },
  { id: 'porch', name: 'Sit on the porch', cost: 15, lvl: 7, req: 'door', finds: ['Old camera', 'Pocket radio', 'Blue teapot', 'Storybook'] },
];
const ALL_FINDS = OUTINGS.flatMap(o => o.finds);
const FIND_LINES = {
  'Four-leaf clover': "Four leaves. ...Do you believe in luck? I'm starting to.",
  'Flea-market teacup': "A teacup with a chip in it. I like it more for the chip.",
  'Night-market lantern': "It still glows a little. Like it remembers the market.",
  'Forest leaf': "It's gold at the edges. Autumn got here before us.",
  'Alley cat photo': "He looked at the camera like he owned the alley. He probably does.",
  'Bus ticket': "To nowhere in particular. Those are the best tickets.",
  'Beach shell': "Hold it to your ear. ...No, it's not the sea. It's just the rain. But still.",
  'Shop receipt': "Two teas and a bun. We had a good day, I think.",
  'Old camera': "Someone left it on the porch step. I'll keep it for them. In case they come back.",
  'Pocket radio': "Only static. But it's friendly static.",
  'Blue teapot': "It matches the one upstairs. We could have a tea party. A very small one.",
  'Storybook': "'The Small Ghost and the Long Rain.' ...It's a joke. It must be a joke.",
};

const TALK = [ // by affinity tier: low, mid, high
  ["I'm tired.", "...what are you looking at?", "It rains here every day. You get used to it.", "You don't have to say anything.", "The rain's loud today."],
  ["I slept a bit better last night.", "Is it still raining? ...Of course it is.", "I think I'm getting used to you being here.", "I made a list in my head. It's mostly 'tea'."],
  ["Thank you for coming back. Every time.", "I'm a little scared of going outside. But maybe with you.", "I want to keep making memories with you.", "I'm not as tired as I used to be."],
];
const TALK_DOWN = [
  ["It's... bigger down here than I remembered.", "Everything creaks. I think that's the house saying hello."],
  ["I keep expecting footsteps on the stairs. It's only you. I like it.", "Down here the rain sounds softer, through the walls.", "Every room has a memory in it. I'm slowly walking through them.", "Do you think a house can miss people?"],
  ["I'm remembering more every day. Some of it is even good.", "The house feels awake. Like it's waiting to be lived in.", "I used to think rooms were for hiding in. Maybe they're for sharing.", "If you listen, the whole house hums when you're here."],
];
const THANKS = ["Hey, you did it.", "One less thing, huh.", "Small steps count.", "I'm glad you're here.", "That's good. Really."];
const THANKS_DOWN = ["One more thing done. The house approves.", "I heard the clock tick right when you finished. ...Coincidence, probably.", "Small steps. Even the stairs only creak once.", "You make this place feel lived in."];

// stories that play when your affinity grows
const LEVEL_SCENES = {
  2: ["(surprised) Something feels different between us now.", "I... don't mind when you visit. I think I even wait for it."],
  3: ["(surprised) Something is different. I feel it.", "I'd like to show you the rest of the house, someday.", "There are stairs, I think. Under all that stuff."],
  4: ["(surprised) Affinity four. I don't know what that means, but my chest feels light.", "Downstairs is where I really lived, you know. Up here was just where I hid."],
  5: ["(surprised) Something's changed again.", "I've been thinking about the photographs. They're somewhere downstairs.", "I think I want to see them."],
  6: ["(surprised) I keep looking at the front door.", "Outside is still scary. But it's less scary with you."],
  7: ["(surprised) I stopped counting the days the rain fell.", "(happy) I started counting the days you visited instead."],
  8: ["(surprised) ...", "I don't know how to say it properly. You're my friend. That's all it is. That's everything."],
};
const ARRIVE_DOWN_FIRST = [
  "(surprised) Oh. It's all still here.",
  "Everything's under sheets. Like the house was holding its breath.",
  "(neutral) Let's wake it up. One small thing at a time.",
];
const ARRIVE_UP_FIRST = ["It feels smaller up here now. In a good way.", "Like a nest. I'd forgotten I made one."];
const INTRO = [
  "(tired) ...Oh. Someone's here.",
  "I'm not much for talking. But you can stay, if you like.",
  "(neutral) The little notes on the side are for goals. Tiny ones count. Maybe I'll try too, if you're helping.",
];
const ENDING = [
  "(surprised) ...Listen.",
  "That's not the rain being quiet. That's just... quiet. The rain stopped.",
  "(happy) Thank you, my friend.",
  "The door's open. Stay as long as you like.",
];

// ---- Art ---------------------------------------------------------------
const A = 'assets/';
const SPR = { // sprite -> natural width (keeps every pose the same scale as idle_breath)
  idle_breath: 141, idle_look_left: 141, idle_look_right: 138, idle_sit: 153, idle_fidget: 138, idle_happy: 180 };
const THUMB = { boxes: 'up_2.webp', web: 'up_3.webp', dust: 'up_3.webp', grime: 'up_1.webp', lamp: 'up_4.webp', rug: 'up_5.webp',
  shelf: 'up_7.webp', plant: 'up_6.webp', tea: 'up_8.webp', stairs: 'dn_stairs.webp', sheets: 'dn_sheets.webp', kitchen: 'dn_kitchen.webp',
  purifier: 'dn_purifier.webp', fern: 'dn_fern.webp', throw: 'dn_throw.webp', clock: 'dn_clock.webp', fireplace: 'dn_fireplace.webp',
  photos: 'dn_photos.webp', door: 'dn_door.webp', umbrella: 'dn_umbrella.webp' };
const FIND_ART = { 'Four-leaf clover': 'out_bushes.webp', 'Flea-market teacup': 'mug.png', 'Night-market lantern': 'candle.png', 'Forest leaf': 'out_tree.webp',
  'Alley cat photo': 'photo.png', 'Bus ticket': 'letter.png', 'Beach shell': 'note2.png', 'Shop receipt': 'note.png',
  'Old camera': 'camera.png', 'Pocket radio': 'radio.png', 'Blue teapot': 'tea_set.png', 'Storybook': 'books_stack.png' };
const el = (tag, cls, attrs = {}) => { const e = document.createElement(tag); if (cls) e.className = cls; Object.assign(e, attrs); return e; };
const art = (file, cls, alt = '') => el('img', cls, { src: A + 'art/' + file, alt, draggable: false });

// ---- Dates -----------------------------------------------------------
const pad = n => String(n).padStart(2, '0');
const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function dayKey(offset = 0) { const d = new Date(); d.setDate(d.getDate() + offset); return fmt(d); }
function weekKey() { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return fmt(d); } // Monday
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);

// ---- State -----------------------------------------------------------
const DEFAULTS = () => ({ points: 0, total: 0, found: [], ending: false, tasks: [], owned: [], floor: 'attic', flags: {}, when: {}, seenDown: 0, last: null });
function load() {
  let s;
  try { s = Object.assign(DEFAULTS(), JSON.parse(localStorage.getItem(KEY))); } catch { s = DEFAULTS(); }
  s.flags = s.flags || {}; s.when = s.when || {};
  // older saves could own downstairs things before the stairs existed
  if (s.owned.some(id => UPG(id) && UPG(id).place === 'Downstairs') && !s.owned.includes('stairs')) s.owned.push('stairs');
  if (s.floor === 'down' && !s.owned.includes('stairs')) s.floor = 'attic';
  return s;
}
let S = load();
let resetting = false;
const save = () => { if (resetting) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

// A task is "done" only for the current period, so it resets by itself.
const periodKey = t => t.type === 'weekly' ? weekKey() : t.type === 'todo' ? 'once' : dayKey();
const isDone = t => t.doneOn === periodKey(t);
const level = () => LEVELS.filter(n => S.total >= n).length;
const streakOf = t => (t.last === dayKey() || t.last === dayKey(-1)) ? t.streak : 0;
const has = id => S.owned.includes(id);
const downCount = () => S.owned.filter(id => UPG(id).place === 'Downstairs').length;
const isDown = () => S.floor === 'down';

// why something can't be done yet ('' = it can)
function why(x) {
  if (level() < x.lvl) return 'Affinity ' + x.lvl;
  if (x.req && !has(x.req)) { const r = UPG(x.req); return 'Needs ' + (r.short || r.name.toLowerCase()); }
  return '';
}

function toggle(id) {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return;
  if (isDone(t)) {                       // undo: take the points back
    S.points = Math.max(0, S.points - t.earned); S.total = Math.max(0, S.total - t.earned);
    t.doneOn = null; t.earned = 0;
    if (t.type === 'habit') { t.streak = Math.max(0, t.streak - 1); t.last = t.streak ? dayKey(-1) : null; }
  } else {
    let p = BASE_POINTS[t.type];
    if (t.type === 'habit') {
      t.streak = (t.last === dayKey(-1) ? t.streak : 0) + 1;
      t.last = dayKey();
      p += Math.min(t.streak - 1, 4);    // streak bonus, max +4
    }
    const before = level();
    t.doneOn = periodKey(t); t.earned = p; S.points += p; S.total += p;
    if (level() > before) {
      scene(LEVEL_SCENES[level()] || ['(surprised) Something feels different between us now.']); playPose('idle_happy', 2600);
    } else { say(pick(isDown() && Math.random() < .5 ? THANKS_DOWN : THANKS), 'happy'); playPose('idle_happy', 1600); }
  }
  save(); render();
}

function buy(id) {
  const u = UPG(id);
  if (!u || has(id) || S.points < u.cost || why(u)) return;
  S.points -= u.cost; S.owned.push(id); S.when[id] = dayKey();
  scene([u.line].concat(u.more || []), 'happy'); playPose('idle_happy', 2000); save(); render();
}

// ---- Dialogue --------------------------------------------------------
const pick = a => a[Math.floor(Math.random() * a.length)];
const moodNow = () => { const r = S.owned.length / UPGRADES.length; return r < .2 ? 0 : r < .5 ? 1 : 2; };
let queue = [], autoT = 0;
// a line may start with "(expression) " to change the portrait
function parseLine(l, expr) { const m = /^\((tired|neutral|happy|sad|surprised|alert)\)\s*/.exec(l); return m ? [l.slice(m[0].length), m[1]] : [l, expr]; }
function say(text, expr, keep) {
  if (!keep) { queue = []; clearTimeout(autoT); }
  const [t, e] = parseLine(text, expr);
  $('#bubbleText').textContent = t;
  $('#portrait').src = A + 'sprites/expr_' + (e || ['tired', 'neutral', 'happy'][moodNow()]) + '.png';
  $('#bubble').classList.toggle('more', queue.length > 0);
  clearTimeout(autoT);
  if (queue.length) autoT = setTimeout(next, Math.max(3800, t.length * 80));
}
// a scene is several lines in a row; tap the bubble or your friend to skip ahead
function scene(lines, expr) { queue = lines.slice(1); say(lines[0], expr, true); }
function next() { if (!queue.length) return false; say(queue.shift(), undefined, true); return true; }
$('#bubble').onclick = next;

// the friend's poses: a resting pose that follows the room's mood, plus short idle moments
let posing = false, poseTimer = 0;
function setSprite(name) { const i = $('#friendImg'); i.src = A + 'sprites/' + name + '.png'; i.parentElement.style.setProperty('--w', SPR[name]); }
function restPose() { return ['idle_sit', 'idle_breath', 'idle_happy'][moodNow()]; }
function playPose(name, ms = 1400) {
  posing = true; setSprite(name); clearTimeout(poseTimer);
  poseTimer = setTimeout(() => { posing = false; setSprite(restPose()); }, ms);
}
setInterval(() => { if (!document.hidden && !$('#friend').matches(':hover')) playPose(pick(['idle_look_left', 'idle_look_right', 'idle_fidget']), 1300); }, 9000);

// things they say because of what is going on right now
function contextLines() {
  const out = [], h = new Date().getHours();
  const daily = S.tasks.filter(t => t.type === 'daily'), left = daily.filter(t => !isDone(t)).length;
  if (left) out.push(`${left} little thing${left > 1 ? 's' : ''} left for today. No rush.`);
  else if (daily.length) out.push("You finished everything for today. ...Sit down. Rest a bit.");
  const best = S.tasks.filter(t => t.type === 'habit').map(t => [streakOf(t), t]).sort((a, b) => b[0] - a[0])[0];
  if (best && best[0] >= 3) out.push(`"${best[1].text}" ${best[0]} days in a row. I'm proud of you.`);
  if (!S.tasks.length) out.push("The notes on the right are for goals. Even tiny ones count.");
  if (h >= 23 || h < 5) out.push("It's really late. ...Sleep soon, okay?");
  else if (h < 11) out.push("Morning. I think the rain sounds quieter today.");
  else if (h >= 18) out.push(has('tea') && !isDown() ? "Evening. Tea?" : "Evening already. The rain always makes the days shorter.");
  return out;
}
function talk() {
  if (next()) return;
  const L = level(), tier = L <= 2 ? 0 : L <= 5 ? 1 : 2;
  const mine = UPGRADES.filter(u => has(u.id));
  const here = mine.filter(u => (u.place === 'Downstairs') === isDown());
  const pool = mine.map(u => u.line)                                // stories from anywhere
    .concat(here.flatMap(u => u.chat || []), here.flatMap(u => u.chat || []))   // but this floor's chat comes up twice as often
    .concat(isDown() ? TALK_DOWN[tier] : TALK[tier], contextLines(), contextLines());
  say(pick(pool));
  playPose(pick(['idle_look_left', 'idle_look_right', 'idle_fidget']), 1500);
}
function go(id) {
  const o = OUTINGS.find(x => x.id === id);
  const left = o.finds.filter(f => !S.found.includes(f));
  if (!left.length || S.points < o.cost || why(o)) return;
  const f = pick(left); S.points -= o.cost; S.found.push(f);
  scene(['(surprised) We found something: ' + f + '. Into the memory box it goes.', FIND_LINES[f]]); save(); render(); postcard(o, f);
}

function postcard(o, find) {
  const pc = $('#postcard'), box = $('#pcArt'); box.replaceChildren(); box.className = '';
  if (o.id === 'park') box.append(art('out_park.webp', '', 'The park in the rain'));
  else {
    box.className = 'trio';
    const set = o.id === 'porch' ? ['out_rain.webp', 'out_bench.webp', 'out_bushes.webp'] : ['out_lamppost.webp', 'out_bench.webp', 'out_tree.webp'];
    for (const f of set) box.append(art(f, '', o.id === 'porch' ? 'The porch' : 'The city'));
  }
  $('#pcCap').textContent = o.name + ' — found: ' + find;
  pc.hidden = false; clearTimeout(pc._t); pc._t = setTimeout(() => pc.hidden = true, 5200);
}
$('#postcard').onclick = () => $('#postcard').hidden = true;

// ---- Floors ----------------------------------------------------------
let moving = false;
function applyFloor() {
  document.body.dataset.floor = S.floor;
  const stage = isDown() ? $('#house') : $('#room');
  stage.insertBefore($('#friend'), stage.querySelector('.dim, .ddim'));   // keep the friend under the lighting
  $('#floorLbl').textContent = isDown() ? 'Attic' : 'Downstairs';
  $('#floorBtn').setAttribute('aria-label', isDown() ? 'Go up to the attic' : 'Go downstairs');
}
function goFloor(f) {
  if (moving || f === S.floor || (f === 'down' && !has('stairs'))) return;
  moving = true; closePanel();
  const fade = $('#fade'); fade.classList.add('on');
  setTimeout(() => {
    S.floor = f; if (f === 'down') S.seenDown = downCount();
    applyFloor(); render(); setSprite(restPose());
    const first = f === 'down' ? 'down' : 'up';
    if (!S.flags[first]) { S.flags[first] = 1; scene(f === 'down' ? ARRIVE_DOWN_FIRST : ARRIVE_UP_FIRST); }
    else say(pick(arrivalLines(f)));
    save(); fade.classList.remove('on'); moving = false;
  }, 400);
}
function arrivalLines(f) {
  if (f === 'up') return ["Back in the attic. It's cosy up here.", "The stairs creaked three times. I counted.", has('lamp') ? "The lamp's still on. Good." : "Home again."];
  const l = ["Hello again, house.", "The stairs creaked three times. I counted."];
  if (has('fireplace')) l.push("Ahh. The fire's still going.");
  if (has('kitchen')) l.push("I think the kettle's been waiting for us.");
  if (has('door')) l.push("I can hear the street through the door.");
  return l;
}
$('#hatch').onclick = () => goFloor('down');
$('#stairsUp').onclick = () => goFloor('attic');
$('#floorBtn').onclick = () => goFloor(isDown() ? 'attic' : 'down');

// ---- Rendering -------------------------------------------------------
function render() {
  $('#pts').textContent = S.points; $('#lvl').textContent = level();

  // rooms
  document.querySelectorAll('[data-add]').forEach(e => e.classList.toggle('on', has(e.dataset.add)));
  document.querySelectorAll('[data-rem]').forEach(e => e.classList.toggle('gone', has(e.dataset.rem)));
  document.body.classList.toggle('lit', has('lamp'));
  for (const [cls, id] of [['k-kitchen', 'kitchen'], ['k-fire', 'fireplace'], ['k-door', 'door']]) document.body.classList.toggle(cls, has(id));
  if (!posing) setSprite(restPose());

  // stairs
  $('#hatch').hidden = !has('stairs');
  $('#floorBtn').hidden = !has('stairs');
  $('#floorBtn .badge').textContent = !isDown() && downCount() > S.seenDown ? '!' : '';

  // tasks: one list per type, one dock icon per list
  for (const type of ['daily', 'weekly', 'habit', 'todo']) {
    const box = $('#list-' + type); box.replaceChildren();
    const list = S.tasks.filter(t => t.type === type);
    document.querySelector(`[data-panel="${type}"] .badge`).textContent = list.filter(t => !isDone(t)).length || '';
    if (!list.length) {
      const p = document.createElement('p'); p.className = 'empty';
      p.textContent = 'Nothing here yet. Use the + button to add one.'; box.append(p);
    }
    const ul = document.createElement('ul'); box.append(ul);
    for (const t of list) {
      const li = document.createElement('li'); li.className = isDone(t) ? 'done' : '';
      const c = document.createElement('button'); c.className = 'check'; c.textContent = isDone(t) ? '✓' : '';
      c.setAttribute('aria-label', (isDone(t) ? 'Undo: ' : 'Complete: ') + t.text);
      c.onclick = () => toggle(t.id);
      const s = document.createElement('span'); s.className = 't'; s.textContent = t.text;
      li.append(c, s);
      if (t.type === 'habit' && streakOf(t)) {
        const k = document.createElement('span'); k.className = 'streak'; k.textContent = streakOf(t) + ' day streak'; li.append(k);
      }
      const d = document.createElement('button'); d.className = 'del'; d.textContent = '✕';
      d.setAttribute('aria-label', 'Delete ' + t.text);
      d.onclick = () => { S.tasks = S.tasks.filter(x => x.id !== t.id); save(); render(); };
      li.append(d); ul.append(li);
    }
  }

  renderOutside();
  renderJournal();
  // shop, one section per floor
  const shop = $('#shop'); shop.replaceChildren();
  for (const place of ['Attic', 'Downstairs']) {
    shop.append(el('li', 'sec', { textContent: place }));
    for (const u of UPGRADES.filter(x => x.place === place)) {
      const own = has(u.id), lock = own ? '' : why(u);
      const li = document.createElement('li'); li.className = own ? 'owned' : '';
      const n = document.createElement('span'); n.className = 't'; n.textContent = u.name;
      const th = art(THUMB[u.id], 'thumb' + (THUMB[u.id].endsWith('.png') ? ' contain' : ''));
      const c = document.createElement('span'); c.className = 'cost'; c.textContent = own ? '' : u.cost;
      const b = document.createElement('button'); b.textContent = own ? 'Done' : 'Do it';
      b.disabled = own || S.points < u.cost || !!lock; b.onclick = () => buy(u.id);
      li.append(th, n);
      if (lock) li.append(lockTag(lock));
      li.append(c, b);
      shop.append(li);
    }
  }
}

function lockTag(text) { const k = el('span', 'lock'); k.append(el('img', '', { src: A + 'ui/lock.png', alt: '' }), document.createTextNode(text)); return k; }
function renderOutside() {
  const ul = $('#outings'); ul.replaceChildren();
  for (const o of OUTINGS) {
    const left = o.finds.filter(f => !S.found.includes(f)).length, lock = why(o);
    const li = document.createElement('li');
    const n = document.createElement('span'); n.className = 't'; n.textContent = o.name + ' (' + (o.finds.length - left) + '/' + o.finds.length + ')';
    const c = document.createElement('span'); c.className = 'cost'; c.textContent = o.cost;
    const b = document.createElement('button'); b.textContent = 'Go';
    b.disabled = !left || S.points < o.cost || !!lock; b.onclick = () => go(o.id);
    li.append(n);
    if (lock) li.append(lockTag(lock));
    li.append(c, b); ul.append(li);
  }
  const mem = $('#memories'); mem.replaceChildren();
  if (!S.found.length) mem.textContent = 'Empty. Outings will fill it.';
  else { const g = el('div', 'finds'); for (const f of S.found) { const d = el('div', 'find' + (FIND_ART[f].endsWith('.webp') ? ' photo' : ''), { title: f }); d.append(art(FIND_ART[f], '', f)); g.append(d); } mem.append(g); }
  // ending: max affinity, everything fixed up, memory box full -> the rain stops
  if (!S.ending && level() === LEVELS.length && S.owned.length === UPGRADES.length && S.found.length === ALL_FINDS.length) {
    S.ending = true; save(); scene(ENDING);
  }
  document.body.classList.toggle('sunny', S.ending);
}

// the journal: one page for every upgrade you have done, in the order you did them
function renderJournal() {
  const box = $('#journal'); box.replaceChildren();
  const done = S.owned.map(UPG).filter(Boolean);
  box.append(el('h3', '', { textContent: `Remembered ${done.length} / ${UPGRADES.length}` }));
  for (const u of done) {
    const e = el('div', 'entry');
    e.append(el('b', '', { textContent: u.name }), el('p', '', { textContent: u.memory }),
      el('small', '', { textContent: u.place + (S.when[u.id] ? ' · ' + S.when[u.id] : '') }));
    box.append(e);
  }
  if (S.ending) { const e = el('div', 'entry'); e.append(el('b', '', { textContent: 'The rain stopped' }), el('p', '', { textContent: 'Thank you, my friend.' })); box.append(e); }
  const locked = UPGRADES.length - done.length;
  if (locked) box.append(el('div', 'entry locked', { textContent: locked + ' more memor' + (locked > 1 ? 'ies' : 'y') + ' still waiting to be remembered.' }));
  document.querySelector('[data-panel="journal"] .badge').textContent = '';
}

// ---- Setup ---------------------------------------------------------------
$('#add').onsubmit = e => {
  e.preventDefault();
  const text = $('#text').value.trim();
  if (!text) return;
  S.tasks.push({ id: Date.now().toString(36), text, type: $('#type').value, doneOn: null, earned: 0, streak: 0, last: null });
  const ty = $('#type').value; $('#text').value = ''; save(); render(); openPanel(ty);
};
$('#friend').onclick = talk;
$('#friend').onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); talk(); } };
document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); }); // new day/week resets

const TITLES = { add: 'New goal', daily: 'Daily goals', weekly: 'Weekly goals', habit: 'Habits', todo: 'To-dos', shop: 'Make the room better', journal: 'Journal', out: 'Outside', settings: 'Settings' };
const drawer = $('#drawer');
function closePanel() {
  drawer.hidden = true; delete drawer.dataset.open;
  document.querySelectorAll('.dock button').forEach(b => b.setAttribute('aria-pressed', 'false'));
  $('#gear').setAttribute('aria-pressed', 'false');
}
function openPanel(name) {
  if (drawer.dataset.open === name) return closePanel();
  drawer.hidden = false; drawer.dataset.open = name;
  document.querySelectorAll('#drawer [data-p]').forEach(p => p.hidden = p.dataset.p !== name);
  $('#dtitle').textContent = TITLES[name];
  if (TYPE_LABEL[name]) $('#type').value = name;
  document.querySelectorAll('.dock button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.panel === name)));
  if (name === 'settings') renderSettings();
  $('#gear').setAttribute('aria-pressed', String(name === 'settings'));
  if (name === 'add') $('#text').focus();
}
document.querySelectorAll('.dock button').forEach(b => b.onclick = () => openPanel(b.dataset.panel));
$('#close').onclick = closePanel;

$('#gear').onclick = () => openPanel('settings');

// settings: the only thing in here is a (confirmed) reset of the save
function renderSettings(confirming = false) {
  const box = $('#settings'); box.replaceChildren();
  box.append(el('h3', '', { textContent: 'Save' }));
  box.append(el('p', '', { textContent: `Affinity ${level()} · ${S.total} hearts earned · ${S.owned.length}/${UPGRADES.length} upgrades · ${S.tasks.length} goal${S.tasks.length === 1 ? '' : 's'}. It is kept in this browser only.` }));
  const row = el('div', 'row');
  if (!confirming) {
    row.append(el('button', '', { textContent: 'Reset save', onclick: () => renderSettings(true) }));
  } else {
    box.append(el('p', 'warn', { textContent: 'This erases all your goals, hearts, upgrades and memories, and your friend forgets everything. It cannot be undone.' }));
    row.append(el('button', 'danger', { textContent: 'Yes, erase everything', onclick: resetSave }), el('button', '', { textContent: 'Keep my save', onclick: () => renderSettings(false) }));
  }
  box.append(row);
}
function resetSave() {
  resetting = true;                       // nothing may write the old state back before the reload
  try { localStorage.removeItem(KEY); } catch {}
  location.reload();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

// ---- Start: say hello the way a friend would -----------------------------
function greet() {
  const brandNew = !S.total && !S.owned.length && !S.tasks.length && !S.flags.intro;
  const away = S.last ? daysBetween(S.last, dayKey()) : 0;
  if (brandNew) { S.flags.intro = 1; scene(INTRO); }
  else if (away >= 3) scene([`(sad) You were gone ${away} days. ...It's okay.`, "(happy) I'm just glad you came back."]);
  else if (away >= 1 && Math.random() < .5) say(pick(["Welcome back. I kept your spot warm.", "There you are. I wondered when you'd come.", "The rain kept me company. But it's better with you."]), 'happy');
  else say(pick(contextLines().concat(isDown() ? TALK_DOWN[Math.min(2, level() <= 2 ? 0 : level() <= 5 ? 1 : 2)] : TALK[0])));
  S.last = dayKey(); save();
}
applyFloor();
render();
setSprite(restPose());
greet();
