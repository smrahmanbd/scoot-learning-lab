/* Group quizzes: ten questions per group. q = question, o = options, a = index of the correct option, e = explanation. */
window.GROUPQUIZ = {
"1": {
"title": "Small nudges (the elastic plan)",
"qs": [
{
"q": "What are the three timing “dials” in SCOOT’s name?",
"o": [
"Speed, flow and density",
"Phase, stage and link",
"Red, amber and green",
"Split, cycle and offset"
],
"a": 3,
"e": "SCOOT = Split Cycle Offset Optimisation Technique: it adjusts those three timing variables."
},
{
"q": "What is the <b>split</b>?",
"o": [
"How the green time is shared between the stages at a junction",
"The time to run every stage once",
"The amber plus all-red time",
"The time between greens at neighbouring junctions"
],
"a": 0,
"e": "The split shares the green; the cycle is the full round of stages; the offset links neighbouring junctions."
},
{
"q": "What is the <b>offset</b>?",
"o": [
"The difference between two splits",
"The time a car takes to cross the junction",
"The length of the amber",
"The time from green at one junction to green at the next one"
],
"a": 3,
"e": "Offsets coordinate neighbours so a platoon released by one junction meets a green at the next (a green wave)."
},
{
"q": "How often does SCOOT’s split optimiser make a decision?",
"o": [
"Once an hour",
"Every 5 minutes",
"Once a day",
"Before every stage change"
],
"a": 3,
"e": "A few seconds before each stage change it tries changing it a little earlier, keeping it, or a little later."
},
{
"q": "How often is the cycle time of a region normally reviewed?",
"o": [
"Every second",
"At every stage change",
"Every 5 minutes (2.5 when traffic is rising)",
"Once a week"
],
"a": 2,
"e": "The cycle optimiser works on a slower clock than the split and offset optimisers."
},
{
"q": "A junction has two stages and a 60 s cycle. How many split decisions does SCOOT make in one hour?",
"o": [
"120",
"60",
"12",
"192"
],
"a": 0,
"e": "3600 ÷ 60 = 60 cycles; two stage changes per cycle; 60 × 2 = 120."
},
{
"q": "Add 120 split decisions, 60 offset decisions (one per cycle) and 12 cycle reviews (every 5 minutes). How many decisions per hour?",
"o": [
"192",
"240",
"180",
"132"
],
"a": 0,
"e": "120 + 60 + 12 = 192 small timing decisions an hour at one junction."
},
{
"q": "Why does SCOOT change the timings by only a few seconds at a time?",
"o": [
"So drivers do not notice the change",
"The controller cannot make bigger changes",
"One wrong guess cannot do much harm, and many small nudges follow the traffic smoothly",
"To save electricity"
],
"a": 2,
"e": "Small, frequent changes are robust: errors stay small and the plan tracks demand like a thermostat."
},
{
"q": "Which everyday object is the best picture of the elastic plan?",
"o": [
"A thermostat that nudges the heating every few minutes",
"A light switch",
"A printed bus timetable",
"A road map"
],
"a": 0,
"e": "A thermostat makes small corrections often. A printed timetable is the picture of a fixed-time plan."
},
{
"q": "How is SCOOT’s elastic plan different from “plan selection”?",
"o": [
"SCOOT lets every junction pick its own cycle freely",
"SCOOT stretches the amber when traffic is heavy",
"SCOOT edits the running plan a little at a time instead of swapping whole stored plans",
"SCOOT swaps between stored plans at fixed times of day"
],
"a": 2,
"e": "Plan selection jumps between pre-made plans; SCOOT keeps one plan and stretches it gently, like elastic."
}
]
},
"2": {
"title": "Detectors and LPUs",
"qs": [
{
"q": "Where is the SCOOT detector loop normally placed?",
"o": [
"Near the far end of the link, just after the upstream junction",
"In the middle of the junction",
"At the stop line",
"On the exit road"
],
"a": 0,
"e": "Upstream placement means cars are counted long before they reach the stop line."
},
{
"q": "What does SCOOT gain from putting the loop there?",
"o": [
"About 10–20 s of warning before the cars reach the stop line",
"A count of pedestrians",
"A cheaper installation",
"An exact speed for every car"
],
"a": 0,
"e": "The warning lets the model predict arrivals and get the green ready in time."
},
{
"q": "How often is a SCOOT loop read?",
"o": [
"Once a second",
"Once a cycle",
"4 times a second",
"Every 5 minutes"
],
"a": 2,
"e": "Each quarter second the loop reports whether it is covered."
},
{
"q": "What does LPU stand for?",
"o": [
"Lane priority unit",
"Link profile unit",
"Loop pulse unit",
"Lost period unit"
],
"a": 1,
"e": "LPUs are SCOOT’s own unit for an amount of traffic, mixing a count with occupancy."
},
{
"q": "Which rule does this lab use to turn a vehicle into LPUs?",
"o": [
"LPU = 1 × vehicle + 2 × seconds the loop is covered",
"LPU = vehicles ÷ seconds",
"LPU = seconds covered only",
"LPU = 2 × vehicle + 1 × seconds covered"
],
"a": 0,
"e": "One unit for being a vehicle, plus two for every second it blocks the loop. (The real TRL coding differs; this is the lab’s teaching rule.)"
},
{
"q": "A 4.5 m car crosses a 2 m loop at 13.5 m/s. How long is the loop covered?",
"o": [
"1.04 s",
"0.33 s",
"0.48 s",
"2.25 s"
],
"a": 2,
"e": "Covered time = (vehicle length + loop length) ÷ speed = 6.5 ÷ 13.5 = 0.48 s."
},
{
"q": "Using the lab’s rule, how many LPUs is that car?",
"o": [
"1.00",
"2.96",
"1.96",
"1.48"
],
"a": 2,
"e": "1 + 2 × 0.48 = 1.96 LPU."
},
{
"q": "A 12 m bus crosses the same loop at the same speed. How many LPUs?",
"o": [
"1.04",
"4.00",
"2.07",
"3.07"
],
"a": 3,
"e": "Covered (12 + 2) ÷ 13.5 = 1.04 s, so 1 + 2 × 1.04 = 3.07 LPU."
},
{
"q": "In a jam, a car crawls slowly over the loop. What happens to its LPU value?",
"o": [
"It stays exactly the same",
"It rises, because the loop is covered for longer",
"It falls",
"It becomes zero"
],
"a": 1,
"e": "Slow traffic covers the loop longer, so LPUs rise: an early sign of congestion."
},
{
"q": "Why does SCOOT use LPUs instead of plain vehicle counts?",
"o": [
"The law requires them",
"LPUs reflect how much green the traffic needs: long or slow vehicles count more",
"LPUs ignore buses",
"LPUs are easier to count"
],
"a": 1,
"e": "A bus needs more green than a car; counting both as “1” would hide that."
}
]
},
"3": {
"title": "Platoons spread",
"qs": [
{
"q": "What is a platoon?",
"o": [
"The queue at the stop line",
"A single lane of a road",
"A bunch of cars released together by the upstream green",
"A convoy of buses only"
],
"a": 2,
"e": "When the upstream light turns green, cars leave together as a platoon."
},
{
"q": "What is a cyclic flow profile?",
"o": [
"The speed of every car",
"A chart of traffic over a whole day",
"The order of the stages",
"The LPUs seen in each second of the cycle, averaged over several cycles"
],
"a": 3,
"e": "One bar per second of the cycle; the platoon shows up as a block of tall bars."
},
{
"q": "Why does a platoon spread out on its way to the stop line?",
"o": [
"The detector misses some cars",
"Drivers travel at different speeds",
"The road gets narrower",
"The signals change colour"
],
"a": 1,
"e": "Fast drivers pull ahead and slow drivers fall behind, so the bunch gets longer and flatter."
},
{
"q": "What is the cruise time T?",
"o": [
"The cycle time",
"The time to clear the queue",
"The length of the green",
"The time to drive from the detector to the stop line"
],
"a": 3,
"e": "It is measured on the street during validation."
},
{
"q": "With T = 10 s and β = 0.8, when do the first predicted arrivals reach the stop line?",
"o": [
"After 10 s",
"After 2 s",
"After 8 s",
"After 12.5 s"
],
"a": 2,
"e": "Lag = β × T = 0.8 × 10 = 8 s: the fastest drivers arrive before the average car."
},
{
"q": "With α = 0.35, β = 0.8 and T = 10 s, what is the smoothing factor F = 1 ÷ (1 + αβT)?",
"o": [
"0.263",
"0.50",
"0.10",
"0.80"
],
"a": 0,
"e": "1 ÷ (1 + 0.35 × 0.8 × 10) = 1 ÷ 3.8 = 0.263."
},
{
"q": "What does F = 0.263 mean?",
"o": [
"The platoon arrives 26% faster",
"26% of each second’s traffic arrives first; 74% spills into later seconds",
"26% of the cycle is green",
"26% of the cars are lost"
],
"a": 1,
"e": "Each second: arrivals = 0.263 × new traffic + 0.737 × last second’s arrivals. Nobody is lost."
},
{
"q": "On a longer road with T = 20 s, F becomes…",
"o": [
"Exactly the same",
"Zero",
"Larger, so the platoon spreads less",
"Smaller (about 0.15), so the platoon spreads more"
],
"a": 3,
"e": "1 ÷ (1 + 0.35 × 0.8 × 20) = 1 ÷ 6.6 ≈ 0.15. The longer the trip, the more the bunch smears out."
},
{
"q": "A steady 1 LPU/s arrives at the loop. Second 1 at the stop line is 0.263. What is second 2?",
"o": [
"0.263",
"0.526",
"0.737",
"0.457"
],
"a": 3,
"e": "0.263 × 1 + 0.737 × 0.263 = 0.263 + 0.194 = 0.457."
},
{
"q": "Compared with the platoon at the detector, the platoon at the stop line has…",
"o": [
"More vehicles",
"The same vehicles, a lower peak and a longer duration",
"Fewer vehicles",
"Exactly the same shape"
],
"a": 1,
"e": "The total is unchanged (10 LPU in the example); it is only rearranged in time, over about 25 s instead of 10 s."
}
]
},
"4": {
"title": "Queue and degree of saturation",
"qs": [
{
"q": "In the bathtub picture of a queue, what is the tap?",
"o": [
"The arriving traffic",
"The queue",
"The saturation occupancy",
"The green light"
],
"a": 0,
"e": "Arrivals pour in all the time; red is the plug; the plughole is the green discharge (SATO)."
},
{
"q": "What is SATO?",
"o": [
"Saturation occupancy: how fast a standing queue drains in green",
"The average speed on the link",
"The amber time",
"The offset between junctions"
],
"a": 0,
"e": "It is measured in LPU per second of green, and checked on site during validation."
},
{
"q": "Arrivals are 0.2 LPU/s and red lasts 35 s. How big is the queue at the end of red?",
"o": [
"7 LPU",
"3.5 LPU",
"12 LPU",
"5 LPU"
],
"a": 0,
"e": "0.2 × 35 = 7 LPU."
},
{
"q": "In green, SATO is 0.6 LPU/s and cars still arrive at 0.2 LPU/s. How fast does the queue shrink?",
"o": [
"0.2 LPU/s",
"0.8 LPU/s",
"0.4 LPU/s",
"0.6 LPU/s"
],
"a": 2,
"e": "Net drain = 0.6 − 0.2 = 0.4 LPU/s."
},
{
"q": "How long does a 7 LPU queue take to clear at 0.4 LPU/s?",
"o": [
"17.5 s",
"7 s",
"12 s",
"28 s"
],
"a": 0,
"e": "7 ÷ 0.4 = 17.5 s after the green starts."
},
{
"q": "What is the degree of saturation (DoS)?",
"o": [
"Delay ÷ stops",
"Queue × SATO",
"Green time ÷ cycle time",
"Demand ÷ what the green can clear"
],
"a": 3,
"e": "DoS = (arrivals per cycle + leftover queue) ÷ (effective green × SATO)."
},
{
"q": "Demand is 0.2 × 60 = 12 LPU per cycle and the green can clear 25 × 0.6 = 15 LPU. What is the DoS?",
"o": [
"0.80",
"1.25",
"1.50",
"0.60"
],
"a": 0,
"e": "12 ÷ 15 = 0.80 (80%): below the 90% target, so there is spare green."
},
{
"q": "Why does SCOOT aim for about 90% rather than 100%?",
"o": [
"To save fuel",
"Because detectors fail above 90%",
"To leave a margin for random surges in traffic",
"Because 100% is illegal"
],
"a": 2,
"e": "Traffic varies from cycle to cycle; a 10% margin stops a single busy cycle from building a queue."
},
{
"q": "A link has a DoS of 1.10. What happens?",
"o": [
"The queue grows every cycle",
"There is plenty of spare green",
"The green is exactly used up",
"There is no traffic"
],
"a": 0,
"e": "Above 1.0 more arrives than the green can clear, so the leftover queue grows each cycle."
},
{
"q": "In the queue model, total delay equals…",
"o": [
"The number of stops",
"The area under the queue-over-time line",
"SATO × green time",
"The length of the red"
],
"a": 1,
"e": "Every vehicle-second spent waiting adds to the area; in the example it is 183.75 LPU·s per cycle."
}
]
},
"5": {
"title": "Validation",
"qs": [
{
"q": "What is validation in SCOOT?",
"o": [
"Tuning each link’s model so it matches what happens on the street",
"Counting accidents",
"Installing new loops",
"Checking the signal bulbs"
],
"a": 0,
"e": "The model is only as good as its settings, and every street is different."
},
{
"q": "The model and the engineer’s stopwatch disagree about when the queue clears. Which is right?",
"o": [
"Neither",
"The street (the stopwatch)",
"The average of the two",
"The model"
],
"a": 1,
"e": "The street is always right: the model is changed to match it."
},
{
"q": "Which formula gives SATO from a stopwatch measurement?",
"o": [
"SATO = clear time ÷ queue",
"SATO = (clear time + start lag) ÷ queue",
"SATO = queue ÷ (clear time − start lag)",
"SATO = queue × start lag"
],
"a": 2,
"e": "Take away the start lag, then divide the queue by the time it took to drain."
},
{
"q": "A 19.5 LPU queue clears 36 s after green starts; the start lag is 3 s. What is SATO?",
"o": [
"0.54 LPU/s",
"0.67 LPU/s",
"0.59 LPU/s",
"0.81 LPU/s"
],
"a": 2,
"e": "19.5 ÷ (36 − 3) = 19.5 ÷ 33 = 0.59 LPU/s."
},
{
"q": "With SATO set to 0.67 LPU/s, when does the model say that 19.5 LPU queue clears (start lag 3 s)?",
"o": [
"After about 29 s",
"After about 32 s",
"After 36 s",
"After 39 s"
],
"a": 1,
"e": "3 + 19.5 ÷ 0.67 = 3 + 29.1 = 32.1 s: 4 s too early compared with the street."
},
{
"q": "What goes wrong if SATO is set too high?",
"o": [
"SCOOT stops working",
"The model thinks queues clear sooner, gives too little green, and real queues grow",
"The cycle doubles",
"SCOOT gives far too much green"
],
"a": 1,
"e": "An optimistic plughole means the model under-estimates how much green the link needs."
},
{
"q": "What is the start lag?",
"o": [
"The travel time between junctions",
"The amber time",
"The time drivers take to get going after the green starts",
"The length of the cycle"
],
"a": 2,
"e": "The first cars react and accelerate before the queue flows at full rate."
},
{
"q": "Which of these is NOT a setting checked during validation?",
"o": [
"The colour of the signal heads",
"Journey (cruise) time",
"Start and end lags",
"Saturation occupancy (SATO)"
],
"a": 0,
"e": "Engineers also check the maximum queue clear time on long links."
},
{
"q": "Which street features can lower SATO?",
"o": [
"Narrow lanes, uphill gradients, parking and turning traffic",
"Wide straight lanes",
"Extra detectors",
"Freshly painted markings"
],
"a": 0,
"e": "Anything that slows the queue leaving the stop line lowers the drain rate."
},
{
"q": "Which analogy fits validation best?",
"o": [
"Reading a map",
"Buying a new car",
"Painting a road",
"Tuning a guitar by ear until it matches a tuning fork"
],
"a": 3,
"e": "A well-built guitar still plays wrong notes until it is tuned; a well-built model needs tuning to its street."
}
]
},
"6": {
"title": "SCOOT vs others",
"qs": [
{
"q": "How does a fixed-time signal decide its green?",
"o": [
"It follows a stored plan",
"It uses stop-line detectors",
"It waits for pedestrians",
"It runs a model fed by upstream detectors"
],
"a": 0,
"e": "Fixed-time plans are often prepared off-line, for example with Webster’s formula or TRANSYT."
},
{
"q": "How does an actuated signal decide its green?",
"o": [
"It copies its neighbour",
"It runs a model of the whole region",
"It extends the green while cars keep arriving at stop-line loops, and ends it on a gap",
"It never changes"
],
"a": 2,
"e": "Actuation reacts to the traffic in front of it, but only locally."
},
{
"q": "Which description fits SCOOT?",
"o": [
"Upstream loops feed a model; small frequent changes; coordinated junctions",
"A stored plan only",
"Random timings",
"One loop at the stop line, no model"
],
"a": 0,
"e": "SCOOT predicts from upstream and adapts split, cycle and offset across a region."
},
{
"q": "In Lab F3 (one junction in SUMO), which controller had the lowest mean delay?",
"o": [
"All the same",
"Fixed time",
"SCOOT",
"Actuated"
],
"a": 2,
"e": "Fixed 18.96 s, actuated 14.48 s, SCOOT 12.79 s per vehicle."
},
{
"q": "SCOOT 12.79 s against fixed time 18.96 s. About how much less delay is that?",
"o": [
"33%",
"25%",
"50%",
"12%"
],
"a": 0,
"e": "(18.96 − 12.79) ÷ 18.96 = 6.17 ÷ 18.96 ≈ 0.33."
},
{
"q": "SCOOT 12.79 s against actuated 14.48 s. About how much less delay?",
"o": [
"5%",
"33%",
"20%",
"12%"
],
"a": 3,
"e": "(14.48 − 12.79) ÷ 14.48 = 1.69 ÷ 14.48 ≈ 0.12."
},
{
"q": "In the four-junction corridor run, which controller had slightly less mean delay?",
"o": [
"All equal",
"Fixed time",
"SCOOT",
"Actuated (29.1 s vs SCOOT 30.4 s)"
],
"a": 3,
"e": "SCOOT is usually better, not always: here actuation edged it on mean delay."
},
{
"q": "In that corridor run, what was SCOOT’s clearest advantage?",
"o": [
"It used the shortest cycle",
"Fewer stops and much less bus delay",
"It was cheapest",
"It needed no detectors"
],
"a": 1,
"e": "Stops 1.10 vs 1.15 per vehicle, and bus delay 22.9 s vs 38.0 s."
},
{
"q": "Where might a simple fixed or actuated controller be good enough?",
"o": [
"On a corridor with closely spaced junctions",
"In a busy city-centre grid",
"Where many buses need priority",
"At an isolated, lightly used junction"
],
"a": 3,
"e": "Adaptive control pays off most where traffic changes and junctions interact."
},
{
"q": "What does SCOOT need in order to work well?",
"o": [
"A fixed cycle",
"Working detectors and a validated model",
"GPS in every car",
"No pedestrians"
],
"a": 1,
"e": "With faulty loops or untuned settings the model’s predictions — and the timings — go wrong."
}
]
}
};
