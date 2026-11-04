/* Group quizzes: six 10-question quizzes per group. q = question, o = options, a = index of the correct option, e = explanation. */
window.GROUPQUIZ = {
"1": {
"title": "Small nudges (the elastic plan)",
"quizzes": [
{
"n": 1,
"title": "Basics",
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
{
"n": 2,
"title": "Key words",
"qs": [
{
"q": "What is the <b>cycle</b> C of a signal?",
"o": [
"The time to run every stage once",
"The time between greens at two neighbouring junctions",
"The share of green given to the main road",
"The amber time at the end of a green"
],
"a": 0,
"e": "The cycle is one full round of stages, for example 60 s; the split shares it out and the offset links neighbours."
},
{
"q": "What is a <b>stage</b>?",
"o": [
"A group of movements that get green together",
"A signalled junction",
"One approach road from detector to stop line",
"The time between one car and the next"
],
"a": 0,
"e": "For example, the main road gets green together in one stage and the side road in the next."
},
{
"q": "In SCOOT, what is a <b>region</b>?",
"o": [
"One lane of one approach road",
"The area covered by one loop detector",
"A group of junctions that all share one cycle time",
"The stretch of road between the loop and the stop line"
],
"a": 2,
"e": "The cycle is shared by all junctions in a region, so neighbours can keep their offsets and a green wave."
},
{
"q": "What is the <b>intergreen</b>?",
"o": [
"The green time given to the side road",
"The amber plus all-red between two stages",
"The time a car takes to cross the loop",
"The gap between two cars in a platoon"
],
"a": 1,
"e": "Intergreen is the changeover between stages; it is partly lost time, when nobody moves well."
},
{
"q": "In SCOOT words, what is a <b>link</b>?",
"o": [
"One approach road, from its detector to its stop line",
"The cable joining two signal poles",
"The time from green at one junction to green at the next",
"A group of junctions sharing a cycle"
],
"a": 0,
"e": "Each link has its own detector and its own small traffic model; the junctions themselves are nodes."
},
{
"q": "SCOOT is called <b>centralised</b>. What does that mean?",
"o": [
"The loops sit in the centre of the junction",
"Each junction decides its own timings on its own",
"One computer in the control centre runs the model and sets the timings for every junction",
"Only the junction in the town centre is controlled"
],
"a": 2,
"e": "One central computer runs a small model for every link every second and sends the new timings out to the signals."
},
{
"q": "SCOOT is called <b>model-based</b>. What does that mean?",
"o": [
"It only works in a computer simulation",
"It copies the timings of a model junction",
"The model’s predictions, not the raw detector counts, decide the timings",
"It picks a model plan from a library each morning"
],
"a": 2,
"e": "The detector counts feed a small traffic model of each link; the model’s profile, queue and DoS drive the optimisers."
},
{
"q": "What does the phrase <b>elastic plan</b> mean?",
"o": [
"The plan is thrown away and rebuilt every second",
"Drivers can stretch the green by pressing a button",
"The amber stretches when the road is wet",
"The timings stretch a little at a time to fit demand, instead of jumping between stored plans"
],
"a": 3,
"e": "SCOOT keeps editing the plan it is running, a few seconds at a time, like elastic that stretches but never snaps."
},
{
"q": "What is a <b>green wave</b>?",
"o": [
"A long green given to buses only",
"Neighbouring signals timed so a platoon released by one meets a green at the next",
"All signals in town turning green at the same moment",
"A green light that flashes before turning amber"
],
"a": 1,
"e": "A good offset ≈ the travel time between junctions, so the platoon arrives just as the next light turns green."
},
{
"q": "Which SCOOT optimiser works on the <b>slowest</b> clock?",
"o": [
"The offset optimiser (every cycle)",
"The cycle optimiser (every 5 minutes)",
"They all work at the same speed",
"The split optimiser (every stage change)"
],
"a": 1,
"e": "Splits change at every stage change, offsets once per cycle, and the region’s cycle only every 5 minutes (2.5 when rising)."
}
]
},
{
"n": 3,
"title": "Numbers and calculations",
"qs": [
{
"q": "A junction runs a 60 s cycle. How many <b>offset</b> decisions does SCOOT make in one hour?",
"o": [
"12",
"120",
"60",
"192"
],
"a": 2,
"e": "Offset decisions are once per cycle: 3600 ÷ 60 = 60. 120 is the split count for two stages; 12 is the cycle count."
},
{
"q": "A junction has three stages and an 80 s cycle. How many <b>split</b> decisions does SCOOT make in an hour?",
"o": [
"240",
"45",
"90",
"135"
],
"a": 3,
"e": "3600 ÷ 80 = 45 cycles; 3 stage changes per cycle; 45 × 3 = 135. 45 forgets to multiply by the stages."
},
{
"q": "While traffic is rising, the region’s cycle is reviewed every 2.5 minutes. How many cycle decisions is that per hour?",
"o": [
"25",
"24",
"12",
"150"
],
"a": 1,
"e": "60 ÷ 2.5 = 24 cycle reviews an hour, twice the usual 60 ÷ 5 = 12."
},
{
"q": "A two-stage junction runs a 90 s cycle, and the cycle is reviewed every 5 minutes. How many timing decisions in total per hour (split + offset + cycle)?",
"o": [
"120",
"92",
"192",
"132"
],
"a": 3,
"e": "3600 ÷ 90 = 40 cycles. Split 40 × 2 = 80, offset 40, cycle 60 ÷ 5 = 12: 80 + 40 + 12 = 132."
},
{
"q": "A 60 s cycle has green A = 26 s and two intergreens of 5 s each. How long is green B?",
"o": [
"34 s",
"29 s",
"24 s",
"19 s"
],
"a": 2,
"e": "60 − 26 − 5 − 5 = 24 s. 29 s forgets one intergreen; 34 s forgets both."
},
{
"q": "A junction has four stages and a 100 s cycle. How many split decisions does SCOOT make in an hour?",
"o": [
"144",
"400",
"36",
"72"
],
"a": 0,
"e": "3600 ÷ 100 = 36 cycles; 4 stage changes per cycle; 36 × 4 = 144."
},
{
"q": "Two junctions are 300 m apart and the traffic travels at 15 m/s. About what offset gives a green wave?",
"o": [
"0.05 s",
"20 s",
"4500 s",
"45 s"
],
"a": 1,
"e": "Good offset ≈ travel time = 300 ÷ 15 = 20 s, so the second green starts about 20 s after the first."
},
{
"q": "Two junctions are 400 m apart and traffic travels at 10 m/s. About what offset should SCOOT walk towards?",
"o": [
"4000 s",
"25 s",
"4 s",
"40 s"
],
"a": 3,
"e": "Travel time = 400 ÷ 10 = 40 s, so the green at the second junction should start about 40 s after the first."
},
{
"q": "The stored green is 22 s. At three stage changes in a row the split optimiser picks the −4 s option, and each time the stored plan moves by 1 s. What is the stored green now?",
"o": [
"10 s",
"18 s",
"21 s",
"19 s"
],
"a": 3,
"e": "Each choice changes the stored plan by only 1 s: 22 − 3 × 1 = 19 s. 10 s wrongly applies the full 4 s each time (22 − 12)."
},
{
"q": "A 48 s cycle loses 12 s per cycle to stage changes. What share of the cycle is lost time?",
"o": [
"4%",
"25%",
"36%",
"12%"
],
"a": 1,
"e": "12 ÷ 48 = 0.25 = 25%. A longer cycle with the same 12 s lost would waste a smaller share."
}
]
},
{
"n": 4,
"title": "What happens if…?",
"qs": [
{
"q": "During the morning rush, more and more cars arrive on the main road. What does SCOOT do to its split?",
"o": [
"It gives the main-road stage a few more seconds of green, step by step",
"It leaves the split alone and only changes the offset",
"It gives all the extra green to the side road",
"It switches to a stored “rush hour” plan at 8:00"
],
"a": 0,
"e": "The split optimiser runs before every stage change and moves green towards the stage that needs it, a few seconds at a time."
},
{
"q": "The cycle time is lengthened from 60 s to 90 s. What happens to the number of split and offset decisions per hour?",
"o": [
"They fall, because there are fewer cycles per hour",
"They drop to zero until the next cycle review",
"They rise, because each cycle is longer",
"They stay the same, because the clock is fixed"
],
"a": 0,
"e": "Cycles per hour fall from 3600 ÷ 60 = 60 to 3600 ÷ 90 = 40, so there are fewer stage changes and fewer offset checks."
},
{
"q": "Traffic in the region starts rising quickly. What happens to how often the cycle is reviewed?",
"o": [
"It is reviewed more often: every 2.5 minutes instead of 5",
"It is reviewed less often, to keep the plan stable",
"It is frozen until traffic settles",
"It is reviewed at every stage change"
],
"a": 0,
"e": "SCOOT reviews the cycle every 5 minutes, and every 2.5 minutes while traffic is rising, so it keeps up with the peak."
},
{
"q": "The busiest (critical) junction in a region rises above about 90% degree of saturation. What does the cycle optimiser do?",
"o": [
"It shortens the cycle of that junction only",
"It switches the junction to flashing amber",
"It lengthens the cycle of the whole region",
"It removes one stage"
],
"a": 2,
"e": "The cycle is shared by the region; a longer cycle wastes a smaller share of time on stage changes and adds capacity."
},
{
"q": "SCOOT lengthens the cycle while the lost time per cycle stays 12 s. What happens to the <b>share</b> of time lost to stage changes?",
"o": [
"It gets smaller",
"It gets bigger",
"It stays exactly the same",
"It becomes zero"
],
"a": 0,
"e": "The same 12 s is spread over a longer cycle: 12 ÷ 44 ≈ 27%, 12 ÷ 64 ≈ 19%, 12 ÷ 88 ≈ 14%."
},
{
"q": "A fixed plan keeps a 24 s green all morning, but the rush brings more traffic than 24 s can clear. What happens?",
"o": [
"The green stretches by itself",
"Nothing changes, because the plan was designed for the average",
"The queue clears faster because drivers hurry",
"A queue piles up and grows every cycle"
],
"a": 3,
"e": "A fixed plan cannot react; when arrivals exceed what the green can clear (DoS above 1), the queue grows cycle after cycle."
},
{
"q": "The peak eases and the critical junction drops well below 90%. What does the cycle optimiser do?",
"o": [
"It holds or shortens the cycle",
"It stops the split optimiser",
"It doubles the offset",
"It lengthens the cycle even more"
],
"a": 0,
"e": "When the peak eases the cycle optimiser holds or shortens the cycle, step by step."
},
{
"q": "The offset between two junctions moves closer to the travel time between them. What happens to stops at the second junction?",
"o": [
"They stay the same, because offsets only affect the first junction",
"The second junction’s cycle doubles",
"They fall, because the platoon now meets a green",
"They rise, because cars arrive too early"
],
"a": 2,
"e": "In the course animation the offset walks 8 s → 16 s → 20 s and stops at J2 fall from 5 to 0, with the PI falling from 230 to 94."
},
{
"q": "SCOOT’s guess about the traffic is wrong for one decision. Why does little harm follow?",
"o": [
"The change was only a few seconds, and the next decision soon corrects it",
"SCOOT never makes wrong guesses",
"The drivers ignore the change",
"The controller undoes all changes at midnight"
],
"a": 0,
"e": "Each nudge is small and there are about 192 decisions an hour at one junction, so one wrong step is quickly put right."
},
{
"q": "At one stage change the split optimiser finds the +4 s option best. What happens to the stored plan?",
"o": [
"It moves by the full 4 s",
"It moves by only 1 s in that direction",
"It is replaced by a new stored plan",
"It does not change at all"
],
"a": 1,
"e": "The trial change (−4/0/+4 s) is used now, but the permanent change is only 1 s, for example 30 → 31 s."
}
]
},
{
"n": 5,
"title": "Everyday pictures",
"qs": [
{
"q": "The course compares SCOOT to a thermostat. Where does that picture <b>break down</b>?",
"o": [
"A thermostat has one knob; SCOOT turns three knobs, each at its own speed, at every junction",
"A thermostat changes once a year",
"A thermostat uses a model; SCOOT uses only raw counts",
"A thermostat makes small changes; SCOOT makes big ones"
],
"a": 0,
"e": "The analogy fits the small, frequent nudges, but SCOOT has split, cycle and offset to turn, each on its own clock."
},
{
"q": "The thermostat “nudges the heating a little every few minutes”. What is the opposite picture in the analogy?",
"o": [
"A heater with three dials",
"A timer that switches between “winter” and “summer” settings",
"A window left open",
"A thermostat that nudges every second"
],
"a": 1,
"e": "Jumping between whole stored settings is like plan selection; the thermostat’s many small nudges are the elastic plan."
},
{
"q": "At the memory-palace town gate, a giant rubber band is stretched around the traffic light. What does the rubber band stand for?",
"o": [
"The loop detector",
"The region boundary",
"The elastic plan",
"The queue at the stop line"
],
"a": 2,
"e": "The band stretches but never snaps, like the timings that change a little at a time; the dials S, C and O are the three knobs."
},
{
"q": "In the same scene, the tiny engineer twangs the band <b>every few seconds</b>. What does that show?",
"o": [
"SCOOT changes the plan once a day",
"The signals break down often",
"SCOOT makes small, frequent changes",
"Drivers keep pressing buttons"
],
"a": 2,
"e": "Many small twangs, never a snap: small, frequent changes that follow the traffic."
},
{
"q": "A signal is described as a teacher letting one row of students out at a time. In that picture, what is one row?",
"o": [
"One car",
"One stage: the movements that get green together",
"One loop detector",
"One whole cycle"
],
"a": 1,
"e": "The teacher gives each row (stage) its turn, over and over; one full round of rows is the cycle."
},
{
"q": "The course pictures three runners: a robot with a printed timetable, a jumpy rabbit and a calm dispatcher with headphones. Which one is SCOOT?",
"o": [
"The rabbit, finishing at 14 and a half",
"The calm dispatcher, finishing just under 13",
"None of them; SCOOT is the finish line",
"The robot, finishing at 19"
],
"a": 1,
"e": "Finish times are the Lab F3 delays: fixed 18.96 s (robot), actuated 14.48 s (rabbit), SCOOT 12.79 s (dispatcher)."
},
{
"q": "In the elastic-plan animation (morning rush), what happens under the fixed 24 s green?",
"o": [
"The green grows with the traffic",
"The queue shrinks as the rush grows",
"A queue piles up because the rush brings more traffic than 24 s can clear",
"The light stays red all morning"
],
"a": 2,
"e": "The fixed plan keeps the same green; SCOOT’s green grows and shrinks with the traffic instead."
},
{
"q": "A cycle bar shows: Green A 26 s, Int. 5, Green B 24 s, Int. 5. What does the whole length of the bar stand for?",
"o": [
"The cycle, 60 s",
"The split, 26 s",
"The lost time, 10 s",
"The offset to the next junction"
],
"a": 0,
"e": "26 + 5 + 24 + 5 = 60 s: one full round of stages is the cycle; how the 50 s of green is shared is the split."
},
{
"q": "In the SCOOT loop diagram, what sits between the detector and the three optimisers?",
"o": [
"The link model: profile, queue and DoS",
"The drivers",
"The stop-line push button",
"A library of stored plans"
],
"a": 0,
"e": "Detector → LPUs each second → link model → split, offset and cycle optimisers → new timings → drivers → detector again."
},
{
"q": "The offset animation is a time–distance picture of two junctions 300 m apart. What does each sloping line show?",
"o": [
"One cycle of the signal",
"One loop detector",
"One traffic light",
"One car moving along the road over time"
],
"a": 3,
"e": "Each line is a car; as the offset walks to about 20 s, the lines reach J2 on green and the stops there fall to 0."
}
]
},
{
"n": 6,
"title": "Exam challenge",
"qs": [
{
"q": "A two-stage junction runs a 60 s cycle during a rising peak, when the cycle is reviewed every 2.5 minutes. How many timing decisions per hour?",
"o": [
"204",
"192",
"216",
"180"
],
"a": 0,
"e": "Split 60 × 2 = 120, offset 60, cycle 60 ÷ 2.5 = 24: 120 + 60 + 24 = 204. 192 uses the normal 5-minute review."
},
{
"q": "Which line matches each knob to its clock correctly?",
"o": [
"All three: once a day",
"Split: every cycle · Offset: every 5 min · Cycle: every stage change",
"Split: every stage change · Offset: every cycle · Cycle: every 5 min",
"Split: every 5 min · Offset: every stage change · Cycle: every cycle"
],
"a": 2,
"e": "Fastest to slowest: split before every stage change, offset once per cycle, the region’s cycle every 5 minutes (2.5 when rising)."
},
{
"q": "Why must neighbouring junctions in a region share one cycle time?",
"o": [
"Otherwise their greens drift apart and the offset (green wave) cannot be kept",
"So that every junction has the same split",
"So the detectors can be read 4 times a second",
"Because the central computer can store only one number"
],
"a": 0,
"e": "An offset only means something if both junctions repeat at the same rhythm; different cycles would slide past each other."
},
{
"q": "An approach has s = 1800 veh/h, green g = 25 s and cycle C = 60 s, with a demand of 540 veh/h. What is its DoS, and is the green big enough?",
"o": [
"0.30; far too much green",
"0.72; no, it is above 1",
"0.72; yes, it is below the ~90% target",
"1.39; no, the queue grows"
],
"a": 2,
"e": "Capacity = 1800 × 25 ÷ 60 = 750 veh/h; DoS = 540 ÷ 750 = 0.72, comfortably below 0.9. 1.39 is the inverted ratio."
},
{
"q": "During a peak, flow ratio Y = 0.78 and lost time L = 12 s. Using DoS = Y × C ÷ (C − L), what is the DoS when SCOOT lengthens the cycle to 64 s?",
"o": [
"0.96",
"0.78",
"0.81",
"1.07"
],
"a": 0,
"e": "0.78 × 64 ÷ (64 − 12) = 49.92 ÷ 52 = 0.96, down from 1.07 at 44 s. 0.81 is the later 88 s value with Y = 0.70."
},
{
"q": "Before a stage change the three trial options give worst DoS: −4 s 0.92, no change 0.80, +4 s 0.71. The stored green is 30 s. What happens?",
"o": [
"−4 s is used, because 0.92 is closest to 90%",
"No change, because 0.80 is already below 90%",
"+4 s is used and the stored green becomes 34 s",
"+4 s is used now and the stored green becomes 31 s"
],
"a": 3,
"e": "The split optimiser picks the option with the lowest worst DoS (0.71), and the permanent change is only 1 s: 30 → 31 s."
},
{
"q": "In Lab F3, mean delay was fixed 18.96 s and SCOOT 12.79 s. About how much less delay did SCOOT give than fixed time?",
"o": [
"About 6 s more",
"About 48%",
"About 12%",
"About 33%"
],
"a": 3,
"e": "(18.96 − 12.79) ÷ 18.96 = 6.17 ÷ 18.96 ≈ 0.33. 48% divides by 12.79 instead; 12% is SCOOT against actuated."
},
{
"q": "How does SCOOT differ from <b>actuated</b> control? (links to group 6)",
"o": [
"There is no difference; both follow a stored plan",
"SCOOT uses upstream loops and a model to adapt split, cycle and offset across a region; actuated extends the green from stop-line loops, locally",
"Actuated changes the cycle of the whole region; SCOOT only one junction",
"SCOOT uses stop-line loops; actuated uses upstream loops"
],
"a": 1,
"e": "Actuation reacts only locally, ending the green on a gap; SCOOT predicts from upstream and coordinates neighbours."
},
{
"q": "Why is the SCOOT detector placed upstream, not at the stop line? (links to group 2)",
"o": [
"Because stop-line loops cannot detect metal",
"So the loop counts only parked cars",
"So the loop is read only once per cycle",
"It gives 10–20 s of warning, so the model can prepare the timings before the platoon arrives"
],
"a": 3,
"e": "A car crossing the upstream loop reaches the stop line 10–20 s later, time enough for the optimisers to act."
},
{
"q": "On a corridor run, SCOOT’s mean delay was 30.4 s against actuated 29.1 s, but stops fell from 1.15 to 1.10 and bus delay from 38.0 to 22.9 s. What is the fair conclusion?",
"o": [
"SCOOT was better in every way",
"SCOOT is not better on every measure, but it gave fewer stops and much less bus delay",
"The numbers prove the detectors were broken",
"SCOOT was worse in every way"
],
"a": 1,
"e": "Mean delay was slightly higher with SCOOT, while stops and bus delay fell; judge a system on several measures, not one."
}
]
}
],
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
"quizzes": [
{
"n": 1,
"title": "Basics",
"qs": [
{
"q": "Where is the SCOOT detector loop normally placed?",
"o": [
"Near the far end of the link, just after the upstream junction",
"In the middle of the junction",
"On the exit road",
"At the stop line"
],
"a": 0,
"e": "Upstream placement means cars are counted long before they reach the stop line."
},
{
"q": "What does SCOOT gain from putting the loop there?",
"o": [
"About 10–20 s of warning before the cars reach the stop line",
"An exact speed for every car",
"A cheaper installation",
"A count of pedestrians"
],
"a": 0,
"e": "The warning lets the model predict arrivals and get the green ready in time."
},
{
"q": "How often is a SCOOT loop read?",
"o": [
"Once a cycle",
"4 times a second",
"Every 5 minutes",
"Once a second"
],
"a": 1,
"e": "Each quarter second the loop reports whether it is covered."
},
{
"q": "What does LPU stand for?",
"o": [
"Loop pulse unit",
"Lost period unit",
"Link profile unit",
"Lane priority unit"
],
"a": 2,
"e": "LPUs are SCOOT’s own unit for an amount of traffic, mixing a count with occupancy."
},
{
"q": "Which rule does this lab use to turn a vehicle into LPUs?",
"o": [
"LPU = 1 × vehicle + 2 × seconds the loop is covered",
"LPU = vehicles ÷ seconds",
"LPU = 2 × vehicle + 1 × seconds covered",
"LPU = seconds covered only"
],
"a": 0,
"e": "One unit for being a vehicle, plus two for every second it blocks the loop. (The real TRL coding differs; this is the lab’s teaching rule.)"
},
{
"q": "A 4.5 m car crosses a 2 m loop at 13.5 m/s. How long is the loop covered?",
"o": [
"0.33 s",
"1.04 s",
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
"1.48",
"1.96"
],
"a": 3,
"e": "1 + 2 × 0.48 = 1.96 LPU."
},
{
"q": "A 12 m bus crosses the same loop at the same speed. How many LPUs?",
"o": [
"1.04",
"2.07",
"4.00",
"3.07"
],
"a": 3,
"e": "Covered (12 + 2) ÷ 13.5 = 1.04 s, so 1 + 2 × 1.04 = 3.07 LPU."
},
{
"q": "In a jam, a car crawls slowly over the loop. What happens to its LPU value?",
"o": [
"It falls",
"It becomes zero",
"It stays exactly the same",
"It rises, because the loop is covered for longer"
],
"a": 3,
"e": "Slow traffic covers the loop longer, so LPUs rise: an early sign of congestion."
},
{
"q": "Why does SCOOT use LPUs instead of plain vehicle counts?",
"o": [
"The law requires them",
"LPUs are easier to count",
"LPUs ignore buses",
"LPUs reflect how much green the traffic needs: long or slow vehicles count more"
],
"a": 3,
"e": "A bus needs more green than a car; counting both as “1” would hide that."
}
]
},
{
"n": 2,
"title": "Key words",
"qs": [
{
"q": "What is a loop detector?",
"o": [
"A coil of wire under the road surface that switches “on” when metal passes over it",
"A radio that talks to each driver’s phone",
"A pressure plate that weighs each vehicle",
"A camera on the signal pole that films the queue"
],
"a": 0,
"e": "The loop is a buried coil of wire; metal passing over it switches it on, so SCOOT knows when it is covered."
},
{
"q": "In SCOOT, what does <b>occupancy</b> describe?",
"o": [
"How long the loop is covered by vehicles",
"How long the green light lasts",
"How many lanes the road has",
"How many people are in each car"
],
"a": 0,
"e": "Occupancy is the covered time (or the share of time the detector is covered); long or slow vehicles cover it longer."
},
{
"q": "In SCOOT words, what is a <b>link</b>?",
"o": [
"The time between two greens",
"One approach road, from its detector to its stop line",
"The cable from the loop to the controller",
"A whole town’s network of signals"
],
"a": 1,
"e": "SCOOT sees a town as junctions joined by one-way approach roads; each approach is a link with its own detector and model."
},
{
"q": "In SCOOT words, what is a <b>node</b>?",
"o": [
"A single car",
"A signalled junction",
"A stage of green",
"A detector loop"
],
"a": 1,
"e": "Nodes are the signalled junctions; links are the approach roads between them."
},
{
"q": "What is a <b>platoon</b>?",
"o": [
"A line of parked cars",
"A row of loops across all lanes",
"A bunch of cars released together by the upstream green",
"A group of signals sharing one cycle"
],
"a": 2,
"e": "The upstream green lets a bunch of cars go together; that bunch is the platoon SCOOT counts at the loop."
},
{
"q": "What is the <b>cruise time T</b> of a link?",
"o": [
"How long the loop is covered by one car",
"How long the green lasts",
"How long a car takes from the detector to the stop line",
"How long one whole cycle lasts"
],
"a": 2,
"e": "T is the detector-to-stop-line travel time, for example 140 m at 14 m/s = 10 s."
},
{
"q": "What does the word <b>upstream</b> mean for a SCOOT detector?",
"o": [
"Uphill from the junction",
"On the side road only",
"Towards where traffic comes from: just after the previous junction",
"Beyond the stop line, on the exit road"
],
"a": 2,
"e": "Upstream is the end of the link traffic enters from, so the loop sees cars long before they reach the lights."
},
{
"q": "What is <b>flow q</b>?",
"o": [
"The share of time the loop is covered",
"The time between two cars",
"The length of the queue",
"The number of vehicles passing per hour (or per second)"
],
"a": 3,
"e": "Flow counts how many pass, in veh/h or veh/s; headway and occupancy are the other two descriptions."
},
{
"q": "What is a <b>headway</b>?",
"o": [
"The distance from loop to stop line",
"The seconds between one car and the next",
"The front half of a platoon",
"The length of a car"
],
"a": 1,
"e": "Headway = 1 ÷ flow; for 0.15 veh/s it is about 6.7 s."
},
{
"q": "Which kind of signal control usually puts its loops at the <b>stop line</b>?",
"o": [
"SCOOT",
"Webster’s method",
"Actuated control",
"Fixed time"
],
"a": 2,
"e": "Actuated loops at the stop line extend the green while cars keep coming; SCOOT puts its loops upstream, and fixed time needs none."
}
]
},
{
"n": 3,
"title": "Numbers and calculations",
"qs": [
{
"q": "A 4 m car crosses a 2 m loop at 12 m/s. Using the lab rule, how many LPUs?",
"o": [
"1.00",
"1.50",
"2.00",
"1.67"
],
"a": 2,
"e": "Covered (4 + 2) ÷ 12 = 0.5 s; LPU = 1 + 2 × 0.5 = <b>2.00</b>. 1.50 forgets the ×2; 1.67 forgets the loop length; 1.00 forgets occupancy."
},
{
"q": "An 8 m van crosses a 2 m loop at 5 m/s. How long is the loop covered?",
"o": [
"1.6 s",
"0.5 s",
"50 s",
"2.0 s"
],
"a": 3,
"e": "Occupancy = (8 + 2) ÷ 5 = 10 ÷ 5 = <b>2.0 s</b>. 1.6 s forgets the loop; 0.5 s divides the wrong way; 50 s multiplies."
},
{
"q": "The course’s 16.5 m lorry crosses the 2 m loop at 9.25 m/s. How many LPUs?",
"o": [
"4.57",
"2.0",
"5.0",
"3.0"
],
"a": 2,
"e": "Covered (16.5 + 2) ÷ 9.25 = 18.5 ÷ 9.25 = 2.0 s; LPU = 1 + 2 × 2.0 = <b>5.0</b>. 3.0 forgets the ×2; 4.57 forgets the loop length; 2.0 is only the covered time."
},
{
"q": "At 13.5 m/s the course’s car is 1.96 LPU and the bus 3.07 LPU. How many “cars” is the bus worth?",
"o": [
"About 1.11",
"About 0.64",
"About 2.67",
"About 1.57"
],
"a": 3,
"e": "3.07 ÷ 1.96 = <b>1.57</b>. 0.64 is the ratio upside down; 1.11 is the difference; 2.67 is just the length ratio 12 ÷ 4.5."
},
{
"q": "The validation lab measured about 1.95 LPU per vehicle. About how many LPUs is a queue of 10 such vehicles?",
"o": [
"39 LPU",
"19.5 LPU",
"10 LPU",
"9.75 LPU"
],
"a": 1,
"e": "10 × 1.95 = <b>19.5 LPU</b>, the queue used in the validation animation. 10 confuses vehicles with LPUs."
},
{
"q": "A loop is 180 m upstream of the stop line and cars drive at 12 m/s. How many seconds of warning does SCOOT get?",
"o": [
"0.07 s",
"168 s",
"15 s",
"2160 s"
],
"a": 2,
"e": "Warning = cruise time = 180 ÷ 12 = <b>15 s</b>, inside the usual 10–20 s. 0.07 s divides the wrong way; 2160 s multiplies."
},
{
"q": "The loop is read 4 times a second. A vehicle covers it for 1.5 s. How many readings say “on”?",
"o": [
"1.5",
"0.375",
"6",
"4"
],
"a": 2,
"e": "1.5 s × 4 readings per second = <b>6</b> readings. 0.375 divides instead of multiplying."
},
{
"q": "In one second, two cars pass the loop and together cover it for 0.5 s. How many LPUs for that second?",
"o": [
"3.0",
"6.0",
"2.0",
"2.5"
],
"a": 0,
"e": "LPU = 1 × 2 vehicles + 2 × 0.5 s = 2 + 1 = <b>3.0</b>. 2.0 counts only vehicles; 2.5 forgets the ×2."
},
{
"q": "A 4.5 m car crosses the 2 m loop at 36 km/h. How many LPUs?",
"o": [
"1.65",
"2.30",
"1.90",
"1.36"
],
"a": 1,
"e": "36 km/h = 36 ÷ 3.6 = 10 m/s; covered 6.5 ÷ 10 = 0.65 s; LPU = 1 + 2 × 0.65 = <b>2.30</b>. 1.36 forgets to convert km/h; 1.90 forgets the loop; 1.65 forgets the ×2."
},
{
"q": "The course’s 12 m bus crawls over the 2 m loop at 6.75 m/s (half of 13.5 m/s). How many LPUs?",
"o": [
"6.14",
"2.07",
"5.15",
"3.07"
],
"a": 2,
"e": "Covered 14 ÷ 6.75 = 2.07 s; LPU = 1 + 2 × 2.07 = <b>5.15</b>. 3.07 is the old speed; 6.14 doubles the whole LPU (the 1 for the vehicle does not double); 2.07 is only the covered time."
}
]
},
{
"n": 4,
"title": "What happens if…?",
"qs": [
{
"q": "A car crosses the loop twice as fast as before. What happens to its covered time and LPU?",
"o": [
"Covered time doubles, so its LPU rises",
"Covered time halves, so its LPU falls towards 1",
"Both stay the same",
"Its LPU doubles"
],
"a": 1,
"e": "Occupancy = (length + loop) ÷ speed, so double speed halves it; the “1 per vehicle” part stays, so LPU falls towards 1."
},
{
"q": "A town fits 4 m loops instead of 2 m loops, with the same traffic. What happens to each vehicle’s LPU?",
"o": [
"It becomes exactly 2 for every vehicle",
"It rises, because each vehicle covers the longer loop for longer",
"It falls, because the loop is less sensitive",
"It stays the same, because LPU depends only on the vehicle"
],
"a": 1,
"e": "Loop length is in the occupancy formula: (vehicle + loop) ÷ speed, so a longer loop means more seconds covered and more LPUs."
},
{
"q": "The SCOOT loop is moved from upstream to the stop line. What is the main loss?",
"o": [
"The loop is read less often",
"The warning: arrivals are seen too late and the loop is covered by the standing queue",
"Buses stop scoring more than cars",
"The loop can no longer count cars at all"
],
"a": 1,
"e": "Upstream loops see cars 10–20 s before they reach the lights; a stop-line loop sits under the queue and sees arrivals too late to predict."
},
{
"q": "The detector counted only vehicles and ignored how long it was covered. What would go wrong?",
"o": [
"SCOOT would give buses too much green",
"A bus and a car would look the same, so the green needed by long vehicles would be underestimated",
"The loop would be read more often",
"Nothing; counts and LPUs are the same thing"
],
"a": 1,
"e": "Occupancy is what makes long vehicles score more; without it a bus counts as “1”, like a car, though it needs more green."
},
{
"q": "At the same speed, a 4.5 m car is replaced by a 7 m van. What happens to the LPU?",
"o": [
"It rises from about 1.96 to about 2.33",
"It falls from about 1.96 to about 1.50",
"It stays at 1.96",
"It jumps to about 3.74"
],
"a": 0,
"e": "Longer vehicle, longer covered time: (7 + 2) ÷ 13.5 = 0.67 s, so 1 + 2 × 0.67 = 2.33. 3.74 is the 16.5 m artic lorry."
},
{
"q": "A loop ends up only 40 m from the stop line, giving about 3 s of cruise time. What happens to SCOOT’s planning?",
"o": [
"The LPU rule changes to 2 × vehicles",
"Nothing changes; distance does not matter",
"It gets far less warning than the usual 10–20 s, so it has less time to act",
"It gets more warning, because cars arrive sooner"
],
"a": 2,
"e": "Warning = cruise time from loop to stop line; a short distance leaves little time to predict and get the green ready."
},
{
"q": "Through the morning the same number of vehicles arrive, but more of them are long lorries. What happens to the LPUs per cycle?",
"o": [
"They fall, because lorries are slower to count",
"They rise, so the model sees more demand and needs more green",
"They drop to zero for lorries",
"They stay the same, because the count is the same"
],
"a": 1,
"e": "Each lorry covers the loop longer and scores more LPUs, so demand in LPU rises even though the count does not, which matches the extra green lorries use."
},
{
"q": "The speed limit on a link drops, and the loop stays in the same place. What happens?",
"o": [
"Cruise time T grows (more warning) and each car covers the loop longer (more LPUs)",
"Nothing changes",
"T shrinks and LPUs fall",
"Only the count changes"
],
"a": 0,
"e": "Lower speed means distance ÷ speed is larger, so T grows; occupancy = (length + loop) ÷ speed also grows, so LPUs rise."
},
{
"q": "A student compares a queue of 10 cars with a model queue of 20 LPU and says “the model doubled the queue”. What has gone wrong?",
"o": [
"Nothing is doubled: 10 cars are about 20 LPU, so the two agree",
"The model has a fault",
"The loop counted every car twice",
"SCOOT always overestimates queues"
],
"a": 0,
"e": "A car is about 2 LPU in this lab, so 10 cars ≈ 20 LPU. Always check vehicles versus LPUs before comparing."
},
{
"q": "A bus slows from 13.5 m/s to 9 m/s over the loop. Which part of its LPU changes?",
"o": [
"Only the “1 × vehicle” part, which grows",
"Neither part changes",
"Only the “2 × seconds covered” part, which grows",
"Both parts halve"
],
"a": 2,
"e": "The vehicle still counts 1; it is the covered time (12 + 2) ÷ speed that grows when the bus is slower, so its LPU rises."
}
]
},
{
"n": 5,
"title": "Everyday pictures",
"qs": [
{
"q": "In the doorman picture, every person pays <b>one coin</b> just to enter. What does that coin stand for in the LPU rule?",
"o": [
"The green time",
"The seconds the loop is covered",
"The “1 × vehicle” count",
"The 2 m loop length"
],
"a": 2,
"e": "LPU = 1 × vehicle + 2 × seconds covered; the entry coin is the count part."
},
{
"q": "The doorman also charges <b>two coins for every second</b> someone blocks the door. What is that in SCOOT terms?",
"o": [
"Reading the loop 4 times a second",
"The 10–20 s warning",
"2 × number of vehicles",
"2 × seconds the loop is occupied"
],
"a": 3,
"e": "The blocking charge is the occupancy part of the LPU: two units per second covered."
},
{
"q": "Why does someone pushing a wide trolley pay about three coins, while a quick walker pays a little over one?",
"o": [
"The trolley blocks the doorway longer, just as a bus covers the loop longer",
"Trolleys are counted as three people",
"The walker gets a discount for speed",
"The doorman dislikes trolleys"
],
"a": 0,
"e": "The bill measures how much of the doorway was used, not just how many came in; a bus scores about 3 LPU, a car about 2."
},
{
"q": "Where does the doorman picture “break”, in a way that turns out useful?",
"o": [
"The loop cannot tell metal from people",
"The doorman only works at night",
"The doorman never charges buses",
"Slow traffic is also charged more, because it stays on the loop longer, and slow traffic usually means queueing"
],
"a": 3,
"e": "A slow car covers the loop longer and scores more LPUs, an early sign of congestion."
},
{
"q": "In the memory palace, the toll doormat lies far from the lights, just past the gate. What does that position remind you of?",
"o": [
"The doormat marks the end of the cycle",
"The doormat is the traffic light",
"The detector sits at the upstream end of the link",
"The detector sits at the stop line"
],
"a": 2,
"e": "The mat is far from the lights, like SCOOT’s upstream loop, which gives 10–20 s of warning."
},
{
"q": "In the bus-stop picture, SCOOT is the dispatcher with a radio who hears “a crowd is coming in 15 seconds”. What gives SCOOT that radio message?",
"o": [
"The driver pressing a button",
"The upstream loop, which counts the platoon before it reaches the stop line",
"A camera watching the queue",
"A printed timetable"
],
"a": 1,
"e": "SCOOT never sees the queue directly; the upstream loop is its early-warning radio."
},
{
"q": "The upstream-detection animation shows a platoon from the upstream green crossing the loop and then reaching the next junction. What is the main point?",
"o": [
"Cars are counted only when they stop",
"The loop changes the lights the moment a car crosses it",
"The platoon is counted long before the stop line, so it can arrive on green",
"The platoon gets shorter as it travels"
],
"a": 2,
"e": "The loop sits just after the upstream junction, so the model can predict when the cars arrive and get the green ready."
},
{
"q": "The slow-motion LPU animation shows a 4.5 m car and a 12 m bus crossing a 2 m loop at 13.5 m/s. What should you notice?",
"o": [
"The car scores more because it is faster",
"The bus keeps the loop covered about twice as long, so it scores about 3.07 LPU against 1.96",
"Both score exactly 1 LPU",
"The loop misses the bus"
],
"a": 1,
"e": "Car covered 0.48 s, bus 1.04 s; LPU = 1 + 2 × covered time gives 1.96 and 3.07."
},
{
"q": "The bar chart shows LPU per vehicle at 13.5 m/s: car 1.96, van 2.33, bus 3.07, artic lorry 3.74. What pattern does it show?",
"o": [
"LPUs fall as vehicles get longer",
"Only buses score more than 2",
"LPUs grow with vehicle length, weighting each vehicle by the green it uses",
"All vehicles score the same"
],
"a": 2,
"e": "Longer vehicles cover the 2 m loop longer, so each bar is taller than the one before."
},
{
"q": "A timeline of loop “on” blocks shows four blocks of about 0.5 s and one of about 1.05 s. What most likely made the wide block?",
"o": [
"A long vehicle, such as a bus, covering the loop longer",
"A gap with no traffic",
"Two cars side by side in different lanes",
"A broken loop"
],
"a": 0,
"e": "Occupancy grows with vehicle length; about 1.05 s matches the 12 m bus at 13.5 m/s (1.04 s), while 0.5 s matches a car."
}
]
},
{
"n": 6,
"title": "Exam challenge",
"qs": [
{
"q": "The lab’s car scores 1.96 LPU and the SUMO validation lab measured 1.95 LPU per vehicle on average. What does this suggest?",
"o": [
"The LPU rule was ignored in SUMO",
"The traffic in the lab was mostly car-like vehicles near that speed",
"Every vehicle in the lab was a bus",
"Occupancy was zero in the lab"
],
"a": 1,
"e": "An average so close to one car’s 1.96 means most vehicles behaved like the 4.5 m car at about 13.5 m/s."
},
{
"q": "Which statement correctly contrasts actuated control and SCOOT?",
"o": [
"Actuated loops at the stop line extend green while cars come; SCOOT’s upstream loops feed a model that predicts",
"Both put loops upstream and use LPUs",
"SCOOT loops are at the stop line; actuated loops are upstream",
"Actuated control uses a model; SCOOT only reacts to gaps"
],
"a": 0,
"e": "Actuated reacts locally at the stop line; SCOOT counts upstream, predicts, and makes small changes across a region."
},
{
"q": "Which two things make a vehicle score more LPUs on a given loop?",
"o": [
"Being heavier and louder",
"Being shorter and going faster",
"Having more passengers and lights on",
"Being longer and going slower"
],
"a": 3,
"e": "Occupancy = (vehicle length + loop length) ÷ speed: longer vehicles and lower speeds both mean more seconds covered."
},
{
"q": "In one cycle, 12 cars and 2 buses cross the loop at 13.5 m/s. About how many LPUs is that?",
"o": [
"23.52",
"28",
"29.66",
"14"
],
"a": 2,
"e": "12 × 1.96 + 2 × 3.07 = 23.52 + 6.14 = <b>29.66 LPU</b>. 14 counts vehicles; 28 treats every vehicle as 2 LPU; 23.52 leaves out the buses."
},
{
"q": "Linking to group 3: a link has cruise time T = 10 s. With β = 0.8, when does the front of a platoon reach the stop line after crossing the loop?",
"o": [
"About 8 s later (lag βT)",
"Exactly 10 s later",
"About 2 s later",
"About 12.5 s later"
],
"a": 0,
"e": "Lag = βT = 0.8 × 10 = <b>8 s</b>: the platoon’s fastest cars arrive before the average cruise time T."
},
{
"q": "Linking to group 4: 9 cars (2 LPU each) arrive per cycle, no residual queue, effective green 25 s, SATO 0.8 LPU/s. What is the DoS?",
"o": [
"1.11",
"0.90",
"0.45",
"0.72"
],
"a": 1,
"e": "Arrivals 9 × 2 = 18 LPU; capacity 25 × 0.8 = 20 LPU; DoS = 18 ÷ 20 = <b>0.90</b>, the SCOOT target. 0.45 uses 9 vehicles instead of 18 LPU; 1.11 is upside down."
},
{
"q": "A student writes: “The queue is 10 cars and SATO is 0.67 LPU/s, so it clears in 10 ÷ 0.67 ≈ 15 s.” What is the main mistake?",
"o": [
"SATO should be in veh/h",
"The loop should be read once a second",
"Mixing units: the queue must be in LPUs (about 19.5), not vehicles",
"Queues never clear"
],
"a": 2,
"e": "SATO is in LPU/s, so the queue must be in LPU too: 10 cars ≈ 19.5 LPU, which takes much longer to clear."
},
{
"q": "A 4.5 m car on the 2 m loop scores exactly 3.0 LPU. How fast was it going?",
"o": [
"4.5 m/s",
"13.5 m/s",
"6.5 m/s",
"3.25 m/s"
],
"a": 2,
"e": "3.0 = 1 + 2 × covered, so covered = 1.0 s; speed = (4.5 + 2) ÷ 1.0 = <b>6.5 m/s</b>. 3.25 m/s would give 2.0 s covered; 13.5 m/s gives only 1.96 LPU."
},
{
"q": "A lane carries 540 veh/h, all cars of about 1.96 LPU. Roughly how many LPU per second pass the loop?",
"o": [
"About 1058 LPU/s",
"About 0.29 LPU/s",
"About 0.15 LPU/s",
"About 6.7 LPU/s"
],
"a": 1,
"e": "540 ÷ 3600 = 0.15 veh/s; 0.15 × 1.96 ≈ <b>0.29 LPU/s</b>. 0.15 forgets to convert to LPU; 6.7 is the headway in seconds."
},
{
"q": "In Lab F3, SCOOT had lower mean delay than actuated control (12.79 s against 14.48 s). Which detector idea helps explain this?",
"o": [
"SCOOT counts only buses",
"Actuated loops cannot detect cars",
"SCOOT’s upstream loops give warning, so it can prepare the green before the platoon arrives",
"SCOOT reads its loops less often"
],
"a": 2,
"e": "Upstream detection gives 10–20 s of warning so SCOOT predicts arrivals; actuated control only reacts at the stop line."
}
]
}
],
"qs": [
{
"q": "Where is the SCOOT detector loop normally placed?",
"o": [
"Near the far end of the link, just after the upstream junction",
"In the middle of the junction",
"On the exit road",
"At the stop line"
],
"a": 0,
"e": "Upstream placement means cars are counted long before they reach the stop line."
},
{
"q": "What does SCOOT gain from putting the loop there?",
"o": [
"About 10–20 s of warning before the cars reach the stop line",
"An exact speed for every car",
"A cheaper installation",
"A count of pedestrians"
],
"a": 0,
"e": "The warning lets the model predict arrivals and get the green ready in time."
},
{
"q": "How often is a SCOOT loop read?",
"o": [
"Once a cycle",
"4 times a second",
"Every 5 minutes",
"Once a second"
],
"a": 1,
"e": "Each quarter second the loop reports whether it is covered."
},
{
"q": "What does LPU stand for?",
"o": [
"Loop pulse unit",
"Lost period unit",
"Link profile unit",
"Lane priority unit"
],
"a": 2,
"e": "LPUs are SCOOT’s own unit for an amount of traffic, mixing a count with occupancy."
},
{
"q": "Which rule does this lab use to turn a vehicle into LPUs?",
"o": [
"LPU = 1 × vehicle + 2 × seconds the loop is covered",
"LPU = vehicles ÷ seconds",
"LPU = 2 × vehicle + 1 × seconds covered",
"LPU = seconds covered only"
],
"a": 0,
"e": "One unit for being a vehicle, plus two for every second it blocks the loop. (The real TRL coding differs; this is the lab’s teaching rule.)"
},
{
"q": "A 4.5 m car crosses a 2 m loop at 13.5 m/s. How long is the loop covered?",
"o": [
"0.33 s",
"1.04 s",
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
"1.48",
"1.96"
],
"a": 3,
"e": "1 + 2 × 0.48 = 1.96 LPU."
},
{
"q": "A 12 m bus crosses the same loop at the same speed. How many LPUs?",
"o": [
"1.04",
"2.07",
"4.00",
"3.07"
],
"a": 3,
"e": "Covered (12 + 2) ÷ 13.5 = 1.04 s, so 1 + 2 × 1.04 = 3.07 LPU."
},
{
"q": "In a jam, a car crawls slowly over the loop. What happens to its LPU value?",
"o": [
"It falls",
"It becomes zero",
"It stays exactly the same",
"It rises, because the loop is covered for longer"
],
"a": 3,
"e": "Slow traffic covers the loop longer, so LPUs rise: an early sign of congestion."
},
{
"q": "Why does SCOOT use LPUs instead of plain vehicle counts?",
"o": [
"The law requires them",
"LPUs are easier to count",
"LPUs ignore buses",
"LPUs reflect how much green the traffic needs: long or slow vehicles count more"
],
"a": 3,
"e": "A bus needs more green than a car; counting both as “1” would hide that."
}
]
},
"3": {
"title": "Platoons spread",
"quizzes": [
{
"n": 1,
"title": "Basics",
"qs": [
{
"q": "What is a platoon?",
"o": [
"A convoy of buses only",
"A single lane of a road",
"The queue at the stop line",
"A bunch of cars released together by the upstream green"
],
"a": 3,
"e": "When the upstream light turns green, cars leave together as a platoon."
},
{
"q": "What is a cyclic flow profile?",
"o": [
"The speed of every car",
"The LPUs seen in each second of the cycle, averaged over several cycles",
"The order of the stages",
"A chart of traffic over a whole day"
],
"a": 1,
"e": "One bar per second of the cycle; the platoon shows up as a block of tall bars."
},
{
"q": "Why does a platoon spread out on its way to the stop line?",
"o": [
"Drivers travel at different speeds",
"The signals change colour",
"The road gets narrower",
"The detector misses some cars"
],
"a": 0,
"e": "Fast drivers pull ahead and slow drivers fall behind, so the bunch gets longer and flatter."
},
{
"q": "What is the cruise time T?",
"o": [
"The time to clear the queue",
"The cycle time",
"The time to drive from the detector to the stop line",
"The length of the green"
],
"a": 2,
"e": "It is measured on the street during validation."
},
{
"q": "With T = 10 s and β = 0.8, when do the first predicted arrivals reach the stop line?",
"o": [
"After 10 s",
"After 12.5 s",
"After 8 s",
"After 2 s"
],
"a": 2,
"e": "Lag = β × T = 0.8 × 10 = 8 s: the fastest drivers arrive before the average car."
},
{
"q": "With α = 0.35, β = 0.8 and T = 10 s, what is the smoothing factor F = 1 ÷ (1 + αβT)?",
"o": [
"0.50",
"0.80",
"0.10",
"0.263"
],
"a": 3,
"e": "1 ÷ (1 + 0.35 × 0.8 × 10) = 1 ÷ 3.8 = 0.263."
},
{
"q": "What does F = 0.263 mean?",
"o": [
"26% of the cycle is green",
"The platoon arrives 26% faster",
"26% of the cars are lost",
"26% of each second’s traffic arrives first; 74% spills into later seconds"
],
"a": 3,
"e": "Each second: arrivals = 0.263 × new traffic + 0.737 × last second’s arrivals. Nobody is lost."
},
{
"q": "On a longer road with T = 20 s, F becomes…",
"o": [
"Zero",
"Larger, so the platoon spreads less",
"Smaller (about 0.15), so the platoon spreads more",
"Exactly the same"
],
"a": 2,
"e": "1 ÷ (1 + 0.35 × 0.8 × 20) = 1 ÷ 6.6 ≈ 0.15. The longer the trip, the more the bunch smears out."
},
{
"q": "A steady 1 LPU/s arrives at the loop. Second 1 at the stop line is 0.263. What is second 2?",
"o": [
"0.526",
"0.457",
"0.263",
"0.737"
],
"a": 1,
"e": "0.263 × 1 + 0.737 × 0.263 = 0.263 + 0.194 = 0.457."
},
{
"q": "Compared with the platoon at the detector, the platoon at the stop line has…",
"o": [
"Fewer vehicles",
"Exactly the same shape",
"The same vehicles, a lower peak and a longer duration",
"More vehicles"
],
"a": 2,
"e": "The total is unchanged (10 LPU in the example); it is only rearranged in time, over about 25 s instead of 10 s."
}
]
},
{
"n": 2,
"title": "Key words",
"qs": [
{
"q": "What does <b>dispersion</b> mean in SCOOT’s link model?",
"o": [
"The detector missing some vehicles",
"The platoon spreading out between the detector and the stop line",
"The queue draining during green",
"Cars leaving the road at side turnings"
],
"a": 1,
"e": "Fast drivers pull ahead and slow ones fall behind, so the bunch arrives longer and flatter; no cars are lost."
},
{
"q": "Which model does SCOOT use to spread the platoon on its way to the stop line?",
"o": [
"The degree-of-saturation rule",
"The bathtub queue model",
"Robertson’s dispersion model",
"Webster’s optimum cycle formula"
],
"a": 2,
"e": "SCOOT shifts and smooths the profile with Robertson’s model, the same one used in the TRANSYT design program."
},
{
"q": "What is <b>TRANSYT</b>, in this course?",
"o": [
"The name of SCOOT’s split optimiser",
"A type of bus priority lane",
"The detector loop SCOOT reads 4 times a second",
"An off-line design program that uses the same profile and dispersion model as SCOOT"
],
"a": 3,
"e": "TRANSYT designs fixed plans for networks off-line; SCOOT is often called an ‘on-line TRANSYT’."
},
{
"q": "In F = 1 ÷ (1 + αβT), what is the <b>smoothing factor F</b>?",
"o": [
"The speed of the platoon in m/s",
"The fraction of the cycle that is green",
"The share of each second’s detected traffic that arrives in the matching second at the stop line",
"The share of cars that are lost on the link"
],
"a": 2,
"e": "Each second: arrivals = F × detected + (1 − F) × last second’s arrivals. A small F means a lot of spreading."
},
{
"q": "What are <b>α</b> and <b>β</b> in Robertson’s model?",
"o": [
"The smoothing weights 0.75 and 0.25",
"Dispersion constants, 0.35 and 0.8, that engineers can tune",
"The cycle time and the green time",
"The start lag and end lag, 3 s and 4 s"
],
"a": 1,
"e": "The glossary gives α = 0.35 and β = 0.8; the model uses fixed constants that can be tuned to the road."
},
{
"q": "What is the <b>lag</b> βT?",
"o": [
"The time from detection until the first predicted arrivals reach the stop line",
"The time between two stage changes",
"The time for the queue to clear",
"The time the loop is covered by one car"
],
"a": 0,
"e": "The front of the platoon arrives at βT = 0.8 T, earlier than the average car, because the fastest drivers lead."
},
{
"q": "In SCOOT words, what is a <b>link</b>?",
"o": [
"One approach road, from its detector to its stop line",
"One stage of the signal plan",
"The cable joining two traffic lights",
"A group of junctions sharing a cycle"
],
"a": 0,
"e": "SCOOT sees a town as nodes (junctions) joined by one-way links, each with its own detector and model."
},
{
"q": "The cyclic flow profile is drawn against “second of the cycle”. Why that axis?",
"o": [
"It shows how long each car takes to cross the loop",
"It counts the cycles since the system started",
"It shows the time of day of the rush hour",
"The signals repeat every cycle, so it shows where in the cycle platoons arrive"
],
"a": 3,
"e": "One bar for each second of the cycle; a platoon released by the same upstream green appears in the same place every cycle."
},
{
"q": "What does <b>profile smoothing</b> (new = 0.75 × old + 0.25 × this cycle) do?",
"o": [
"Spreads the platoon from detector to stop line",
"Shortens the cycle by 25%",
"Blends each new cycle in gently so one odd cycle cannot dominate",
"Removes buses from the count"
],
"a": 2,
"e": "One odd cycle can move a bar only a quarter of the way; the regular platoon stands out while noise fades."
},
{
"q": "In the stop-line curve of a dispersed platoon, what is the <b>tail</b>?",
"o": [
"The slower drivers who arrive after the main bunch",
"The cars waiting in the queue from the last cycle",
"The first cars to arrive",
"The cars lost on the way"
],
"a": 0,
"e": "The trap note says the front arrives at 0.8 T and the rest arrive later in the tail; the curve fades away over about 15 s."
}
]
},
{
"n": 3,
"title": "Numbers and calculations",
"qs": [
{
"q": "A link is 180 m long and cars cruise at 12 m/s. What are the cruise time T and the lag βT?",
"o": [
"T = 15 s, lag 15 s",
"T = 0.067 s, lag 0.053 s",
"T = 12 s, lag 9.6 s",
"T = 15 s, lag 12 s"
],
"a": 3,
"e": "T = 180 ÷ 12 = 15 s; lag = 0.8 × 15 = 12 s. The lag is not the full T; dividing 12 ÷ 180 inverts the ratio."
},
{
"q": "Find F for a short link with cruise time T = 5 s.",
"o": [
"0.583",
"0.417",
"0.364",
"0.200"
],
"a": 1,
"e": "F = 1 ÷ (1 + 0.35 × 0.8 × 5) = 1 ÷ 2.4 = 0.417. 0.364 forgets β, 0.583 is 1 − F, 0.200 is 1 ÷ T."
},
{
"q": "Find F for a long link with cruise time T = 25 s.",
"o": [
"0.143",
"0.875",
"0.103",
"0.125"
],
"a": 3,
"e": "F = 1 ÷ (1 + 0.35 × 0.8 × 25) = 1 ÷ (1 + 7) = 0.125. 0.103 forgets β, 0.875 is 1 − F, 0.143 = 1 ÷ 7 forgets the 1 +."
},
{
"q": "The course’s long-link example has T = 20 s. What is the lag?",
"o": [
"25 s",
"4 s",
"16 s",
"20 s"
],
"a": 2,
"e": "Lag = β × T = 0.8 × 20 = 16 s. 20 s is the full cruise time, 25 s divides by 0.8, 4 s is 0.2 × T."
},
{
"q": "Worked example (T = 10 s, F = 0.263, steady 1 LPU/s at the loop): second 2 at the stop line was 0.457. What is second 3?",
"o": [
"0.600",
"0.337",
"0.720",
"0.457"
],
"a": 0,
"e": "0.263 × 1 + 0.737 × 0.457 = 0.263 + 0.337 = 0.600. 0.337 forgets the new traffic; 0.720 forgets to multiply 0.457 by 0.737."
},
{
"q": "In the worked example the stop-line arrival peaks at 0.95, then the platoon at the loop ends (0 LPU/s). What is the next second’s arrival (F = 0.263)?",
"o": [
"0.70",
"0.95",
"0",
"0.25"
],
"a": 0,
"e": "0.263 × 0 + 0.737 × 0.95 ≈ 0.70. The arrivals fade gradually; they do not drop to zero at once. 0.25 uses F instead of 1 − F."
},
{
"q": "A profile bar was 4 LPU. This cycle the loop saw 8 LPU in that second. With smoothing new = 0.75 × old + 0.25 × new, what is the bar now?",
"o": [
"8.0 LPU",
"7.0 LPU",
"5.0 LPU",
"6.0 LPU"
],
"a": 2,
"e": "0.75 × 4 + 0.25 × 8 = 3 + 2 = 5.0. 6.0 is a plain average; 7.0 swaps the weights; 8.0 ignores the history."
},
{
"q": "Suppose F = 0.5. This second the loop sees 2 LPU and last second’s stop-line arrival was 1 LPU. What is this second’s arrival?",
"o": [
"3.0 LPU",
"1.5 LPU",
"1.0 LPU",
"2.0 LPU"
],
"a": 1,
"e": "0.5 × 2 + (1 − 0.5) × 1 = 1 + 0.5 = 1.5. 3.0 adds without the shares F and 1 − F."
},
{
"q": "A platoon crosses the loop at 2 LPU/s for 6 s. How many LPU in total reach the stop line after dispersion?",
"o": [
"6 LPU",
"Fewer than 12, because the peak is lower",
"12 LPU",
"24 LPU"
],
"a": 2,
"e": "Total = 2 × 6 = 12 LPU. Robertson’s recipe only rearranges arrivals in time; the area under the curve is unchanged."
},
{
"q": "On the course’s 10-second link (F = 0.263), the first second of a platoon brings 2 LPU at the loop. What is the first predicted second at the stop line?",
"o": [
"2.0 LPU",
"0.526 LPU",
"1.474 LPU",
"0.263 LPU"
],
"a": 1,
"e": "0.263 × 2 + 0.737 × 0 = 0.526. 0.263 forgets the 2 LPU; 1.474 uses 1 − F instead of F."
}
]
},
{
"n": 4,
"title": "What happens if…?",
"qs": [
{
"q": "A link is shortened so its cruise time falls from 20 s to 10 s. What happens to F and the platoon?",
"o": [
"F falls and the platoon spreads more",
"F rises (0.152 → 0.263) and the platoon stays tighter",
"F stays the same; only the lag changes",
"The platoon loses fewer cars"
],
"a": 1,
"e": "F = 1 ÷ (1 + 0.28 T): a smaller T gives a bigger F, so less of each second is smeared into later seconds."
},
{
"q": "Cars drive the same link more slowly, so the cruise time grows. What happens to the lag βT?",
"o": [
"It stays at 8 s on every link",
"It becomes equal to the cycle time",
"It grows, so the first arrivals come later",
"It shrinks, so the first arrivals come sooner"
],
"a": 2,
"e": "The lag is 0.8 × T, so it grows with T; for example T = 10 → 8 s, T = 20 → 16 s."
},
{
"q": "An engineer tunes α upwards for a road where drivers’ speeds vary a lot. What happens?",
"o": [
"F rises and the platoon is predicted tighter",
"More vehicles are predicted to arrive",
"αβT grows, F falls and the model spreads the platoon more",
"The lag becomes zero"
],
"a": 2,
"e": "F = 1 ÷ (1 + αβT): a bigger α makes the bottom bigger, so F is smaller and the spreading larger. The total stays the same."
},
{
"q": "The platoon at the loop suddenly ends. What happens to the predicted stop-line arrivals?",
"o": [
"They drop to zero in the same second",
"They stay at the peak value for the rest of the cycle",
"They fade out gradually, keeping 74% of the previous second each second (T = 10 s)",
"They jump up to a new peak"
],
"a": 2,
"e": "With no new traffic, arrivals = (1 − F) × previous = 0.737 × previous, so the tail decays over about 15 s."
},
{
"q": "The platoon seen at the loop doubles from 1 to 2 LPU/s, everything else equal. What happens to the stop-line curve?",
"o": [
"Only the first second doubles",
"It spreads over twice as long",
"It arrives twice as early",
"Every value doubles; the shape and timing stay the same"
],
"a": 3,
"e": "Each step is F × detected + (1 − F) × previous, so doubling every detected value doubles every arrival (second 1 becomes 0.526 instead of 0.263)."
},
{
"q": "One cycle a bus breakdown upstream gives an unusually empty second in the profile. What happens to that profile bar?",
"o": [
"Nothing; the profile never changes",
"It is replaced completely by the odd value",
"It moves only a quarter of the way towards the odd value",
"It is deleted from the profile"
],
"a": 2,
"e": "New bar = 0.75 × old + 0.25 × this cycle, so one odd cycle shifts it only 25% of the way."
},
{
"q": "If SCOOT used the detector profile at the stop line without shifting it forward, what would go wrong?",
"o": [
"It would expect the cars too early, roughly 0.8 T before they really arrive",
"It would count fewer cars",
"Nothing; the stop line sees the same profile",
"It would expect the cars too late"
],
"a": 0,
"e": "Cars need about the cruise time to reach the stop line; the model shifts the profile forward (front at 0.8 T) to match when they really arrive."
},
{
"q": "Two junctions are far apart, so the platoon has smeared almost into steady flow. What happens to the benefit of coordinating them?",
"o": [
"It becomes smaller, because there is no tight bunch left to catch on green",
"It becomes larger, because the platoon is longer",
"It is unchanged by distance",
"Coordination becomes impossible because cars are lost"
],
"a": 0,
"e": "The green wave works best when platoons stay tight; on a long road the platoon has smeared out, so the offset matters less."
},
{
"q": "Imagine a link so short that T is almost 0. What does Robertson’s recipe predict?",
"o": [
"F ≈ 0, so the platoon spreads forever",
"F ≈ 1, so the stop-line arrivals copy the detector profile with almost no spreading",
"Half the cars disappear",
"The lag becomes very long"
],
"a": 1,
"e": "F = 1 ÷ (1 + 0.28 × 0) = 1, so arrivals = 1 × detected + 0 × previous: no shift and no smear."
},
{
"q": "Dispersion lowers and lengthens the platoon. What happens to the total LPU arriving in the cycle?",
"o": [
"It falls by the share F",
"It rises because the platoon is longer",
"It stays the same",
"It falls to about 0.95 of the original"
],
"a": 2,
"e": "Nothing is lost, only rearranged in time: the 10 LPU of the worked example still arrive, over about 25 s. 0.95 is the peak height, not the total."
}
]
},
{
"n": 5,
"title": "Everyday pictures",
"qs": [
{
"q": "In the course’s picture of a school class walking from the gate to the bus stop, what stands for dispersion?",
"o": [
"Fast walkers pulling ahead and slow ones falling behind",
"The teacher counting the children at the gate",
"Children getting lost on the way",
"The bus arriving late"
],
"a": 0,
"e": "The class leaves together but arrives over a longer time, just like a platoon between detector and stop line."
},
{
"q": "In the school-class picture, what does the bus stop stand for?",
"o": [
"The upstream detector",
"The traffic control centre",
"The cycle time",
"The stop line"
],
"a": 3,
"e": "The class leaves the gate (the upstream junction and loop) and is spread out by the time it reaches the bus stop (the stop line)."
},
{
"q": "“At the bus stop the class arrives over a longer time, and the busiest moment is less busy.” Which result does this picture?",
"o": [
"The platoon arriving exactly T seconds later, unchanged",
"More vehicles at the stop line",
"Same vehicles, a lower peak and a longer duration",
"A higher peak at the stop line"
],
"a": 2,
"e": "In the worked example the peak falls from 1.0 to 0.95 and the platoon lasts about 25 s instead of 10 s."
},
{
"q": "Where does the school-class analogy break down, according to the course?",
"o": [
"Cars cannot overtake freely on a busy road, and the model’s constants are tuned",
"Cars never travel at different speeds",
"Children are counted in LPUs",
"Buses never stop at bus stops"
],
"a": 0,
"e": "Real dispersion depends on the road, so engineers can tune the fixed constants α and β."
},
{
"q": "In the memory palace, a marching band of <b>35</b> players crosses a bridge under a sign “walk at <b>80%</b> speed”. What do 35 and 80% encode?",
"o": [
"35 m of road at 80 km/h",
"A 35 s green and an 80 s cycle",
"α = 0.35 and β = 0.8",
"35 LPU and 80% DoS"
],
"a": 2,
"e": "35 players → α = 0.35; 80% speed → β = 0.8. The band spreading out is dispersion."
},
{
"q": "In the marching-band scene, what does the far end of the bridge stand for?",
"o": [
"The start of the green",
"The region’s cycle time",
"The stop line, where the spread-out band arrives",
"The upstream detector"
],
"a": 2,
"e": "The band leaves in a tight block and arrives at the far end spread out, with trombones early and drummers trailing."
},
{
"q": "In the platoon-spreading animation, green dots are fast drivers and orange dots are slow ones. What should you notice at the stop line compared with the loop?",
"o": [
"The orange dots have disappeared",
"The same cars arrive over a longer time with a lower peak",
"There are more green dots than at the loop",
"The cars arrive in a tighter bunch"
],
"a": 1,
"e": "The caption says: same cars, longer time, lower peak; a longer road means more spreading."
},
{
"q": "In the “Robertson’s recipe” animation, what do the dark and light parts of each bar show?",
"o": [
"Dark = green time; light = red time",
"Dark = the queue; light = the cars that left",
"Dark = F × traffic detected now; light = (1 − F) × last second’s arrival carried over",
"Dark = cars; light = buses"
],
"a": 2,
"e": "Each second’s arrival is a share F of the new traffic plus the rest of last second’s arrival, like a running average."
},
{
"q": "The course chart shows the platoon “at the detector” and “at the stop line” (T = 10 s). What is true about the two curves?",
"o": [
"The stop-line curve starts about 8 s later, rises gradually, and has the same area (10 LPU)",
"Both curves start at the same moment",
"The stop-line curve is taller and narrower",
"The stop-line curve has a smaller area because cars are lost"
],
"a": 0,
"e": "The front arrives at 0.8 × 10 = 8 s; the area under both curves is the same 10 LPU."
},
{
"q": "The cyclic-flow-profile animation runs five cycles with two charts. What do they show?",
"o": [
"Top: the queue; bottom: the green times",
"Top: the main road; bottom: the side road",
"Top: cars; bottom: buses",
"Top: this cycle’s counts; bottom: the smoothed profile SCOOT keeps"
],
"a": 3,
"e": "Each new cycle is blended in at 25%, so the platoon’s place in the cycle stands out while random noise fades."
}
]
},
{
"n": 6,
"title": "Exam challenge",
"qs": [
{
"q": "Worked example (T = 10 s, steady 1 LPU/s): the first three stop-line seconds are 0.263, 0.457 and 0.600. How many LPU have arrived after 3 s?",
"o": [
"0.60 LPU",
"1.32 LPU",
"3.00 LPU",
"0.79 LPU"
],
"a": 1,
"e": "0.263 + 0.457 + 0.600 = 1.32 LPU, while 3 LPU have crossed the loop: the rest is still to come in later seconds. 0.79 = 3 × 0.263 forgets the carry-over."
},
{
"q": "Junctions are 300 m apart and cars cruise at 15 m/s. Using Robertson’s model, find T, the lag and F.",
"o": [
"T = 20 s, lag 16 s, F = 0.848",
"T = 20 s, lag 20 s, F = 0.263",
"T = 20 s, lag 16 s, F = 0.152",
"T = 4500 s, lag 3600 s, F ≈ 0"
],
"a": 2,
"e": "T = 300 ÷ 15 = 20 s; lag = 0.8 × 20 = 16 s; F = 1 ÷ (1 + 0.35 × 0.8 × 20) = 1 ÷ 6.6 = 0.152. 0.848 is 1 − F."
},
{
"q": "A student says: “On a 10 s link the platoon’s front reaches the stop line 10 s after the loop.” What is the best correction?",
"o": [
"The front arrives at βT = 8 s, because the fastest drivers lead; others follow in the tail",
"The front arrives at 2.63 s, because F = 0.263",
"The front arrives at once, because the loop is at the stop line",
"The front arrives at 12.5 s, because cars slow down"
],
"a": 0,
"e": "The lag is 0.8 T, not T (a listed confusion). The SCOOT loop is upstream, not at the stop line."
},
{
"q": "Which of these four links spreads a platoon the most?",
"o": [
"Cruise time 10 s (F = 0.263)",
"Cruise time 5 s (F = 0.417)",
"Cruise time 15 s (F = 0.192)",
"Cruise time 25 s (F = 0.125)"
],
"a": 3,
"e": "The smaller F, the less of each second arrives at once and the more spreading; F falls as T grows."
},
{
"q": "Why does the worked-example peak reach only 0.95 and not 1.0 LPU/s?",
"o": [
"The detector misses one car in twenty",
"The platoon at the loop ends after 10 s, before the running average catches up with 1.0",
"β = 0.8 removes 20% of the traffic",
"5% of the cars are lost on the link"
],
"a": 1,
"e": "With steady 1 LPU/s the arrivals would creep towards 1.0 (1 − 0.737¹⁰ ≈ 0.95 after 10 s), but the input stops first. Nothing is lost."
},
{
"q": "A profile bar is 4 LPU. Two cycles in a row each see 8 LPU in that second. Using new = 0.75 × old + 0.25 × new, what is the bar after the second cycle?",
"o": [
"8.0 LPU",
"5.0 LPU",
"6.0 LPU",
"5.75 LPU"
],
"a": 3,
"e": "Cycle 1: 0.75 × 4 + 0.25 × 8 = 5.0. Cycle 2: 0.75 × 5 + 0.25 × 8 = 3.75 + 2 = 5.75. A lasting change is followed, but gently."
},
{
"q": "Dispersion changes a link’s predicted arrivals. Which does it change?",
"o": [
"The total LPU arriving per cycle, which sets the DoS",
"The number of vehicles counted at the loop",
"The saturation occupancy SATO",
"When in the cycle the cars arrive, which matters for the best offset"
],
"a": 3,
"e": "The total is conserved, so arrivals per cycle in the DoS are unchanged; the timing within the cycle changes, which is what offsets and stops depend on."
},
{
"q": "Neighbouring group (offsets): junctions are 10 s of cruise time apart. Why should SCOOT use the dispersed stop-line profile, not the loop profile, when judging offsets?",
"o": [
"The green should meet the cars when they really reach the stop line, which is later and more spread than at the loop",
"The loop profile has fewer cars in it",
"Offsets are chosen only from the cycle time",
"The loop profile already shows the queue"
],
"a": 0,
"e": "Good offset ≈ travel time; the model shifts the profile (front at 8 s) and spreads it so the offset optimiser judges delay and stops from true arrivals."
},
{
"q": "The same platoon is detected on two links: A with T = 10 s and B with T = 20 s. Which statement is right?",
"o": [
"B: the same lag but more cars",
"B: first arrivals later (16 s vs 8 s) and a flatter peak (F 0.152 vs 0.263)",
"B: first arrivals earlier and a taller peak",
"A and B give identical stop-line curves"
],
"a": 1,
"e": "Lag = 0.8 T gives 8 s and 16 s; F = 1 ÷ (1 + 0.28 T) gives 0.263 and 0.152. Longer link → later and more spread."
},
{
"q": "Neighbouring group (queue model): what role do Robertson’s predicted stop-line arrivals play in the bathtub picture?",
"o": [
"They are the tap: the arrival rate filling the queue during red",
"They are the plughole draining the queue",
"They are the plug, deciding when green starts",
"They are the size of the bathtub"
],
"a": 0,
"e": "The queue model fills the bathtub from the predicted arrivals and drains it at SATO during green; SCOOT models the queue from the upstream counts."
}
]
}
],
"qs": [
{
"q": "What is a platoon?",
"o": [
"A convoy of buses only",
"A single lane of a road",
"The queue at the stop line",
"A bunch of cars released together by the upstream green"
],
"a": 3,
"e": "When the upstream light turns green, cars leave together as a platoon."
},
{
"q": "What is a cyclic flow profile?",
"o": [
"The speed of every car",
"The LPUs seen in each second of the cycle, averaged over several cycles",
"The order of the stages",
"A chart of traffic over a whole day"
],
"a": 1,
"e": "One bar per second of the cycle; the platoon shows up as a block of tall bars."
},
{
"q": "Why does a platoon spread out on its way to the stop line?",
"o": [
"Drivers travel at different speeds",
"The signals change colour",
"The road gets narrower",
"The detector misses some cars"
],
"a": 0,
"e": "Fast drivers pull ahead and slow drivers fall behind, so the bunch gets longer and flatter."
},
{
"q": "What is the cruise time T?",
"o": [
"The time to clear the queue",
"The cycle time",
"The time to drive from the detector to the stop line",
"The length of the green"
],
"a": 2,
"e": "It is measured on the street during validation."
},
{
"q": "With T = 10 s and β = 0.8, when do the first predicted arrivals reach the stop line?",
"o": [
"After 10 s",
"After 12.5 s",
"After 8 s",
"After 2 s"
],
"a": 2,
"e": "Lag = β × T = 0.8 × 10 = 8 s: the fastest drivers arrive before the average car."
},
{
"q": "With α = 0.35, β = 0.8 and T = 10 s, what is the smoothing factor F = 1 ÷ (1 + αβT)?",
"o": [
"0.50",
"0.80",
"0.10",
"0.263"
],
"a": 3,
"e": "1 ÷ (1 + 0.35 × 0.8 × 10) = 1 ÷ 3.8 = 0.263."
},
{
"q": "What does F = 0.263 mean?",
"o": [
"26% of the cycle is green",
"The platoon arrives 26% faster",
"26% of the cars are lost",
"26% of each second’s traffic arrives first; 74% spills into later seconds"
],
"a": 3,
"e": "Each second: arrivals = 0.263 × new traffic + 0.737 × last second’s arrivals. Nobody is lost."
},
{
"q": "On a longer road with T = 20 s, F becomes…",
"o": [
"Zero",
"Larger, so the platoon spreads less",
"Smaller (about 0.15), so the platoon spreads more",
"Exactly the same"
],
"a": 2,
"e": "1 ÷ (1 + 0.35 × 0.8 × 20) = 1 ÷ 6.6 ≈ 0.15. The longer the trip, the more the bunch smears out."
},
{
"q": "A steady 1 LPU/s arrives at the loop. Second 1 at the stop line is 0.263. What is second 2?",
"o": [
"0.526",
"0.457",
"0.263",
"0.737"
],
"a": 1,
"e": "0.263 × 1 + 0.737 × 0.263 = 0.263 + 0.194 = 0.457."
},
{
"q": "Compared with the platoon at the detector, the platoon at the stop line has…",
"o": [
"Fewer vehicles",
"Exactly the same shape",
"The same vehicles, a lower peak and a longer duration",
"More vehicles"
],
"a": 2,
"e": "The total is unchanged (10 LPU in the example); it is only rearranged in time, over about 25 s instead of 10 s."
}
]
},
"4": {
"title": "Queue and degree of saturation",
"quizzes": [
{
"n": 1,
"title": "Basics",
"qs": [
{
"q": "In the bathtub picture of a queue, what is the tap?",
"o": [
"The saturation occupancy",
"The arriving traffic",
"The queue",
"The green light"
],
"a": 1,
"e": "Arrivals pour in all the time; red is the plug; the plughole is the green discharge (SATO)."
},
{
"q": "What is SATO?",
"o": [
"The amber time",
"The average speed on the link",
"Saturation occupancy: how fast a standing queue drains in green",
"The offset between junctions"
],
"a": 2,
"e": "It is measured in LPU per second of green, and checked on site during validation."
},
{
"q": "Arrivals are 0.2 LPU/s and red lasts 35 s. How big is the queue at the end of red?",
"o": [
"5 LPU",
"3.5 LPU",
"12 LPU",
"7 LPU"
],
"a": 3,
"e": "0.2 × 35 = 7 LPU."
},
{
"q": "In green, SATO is 0.6 LPU/s and cars still arrive at 0.2 LPU/s. How fast does the queue shrink?",
"o": [
"0.6 LPU/s",
"0.8 LPU/s",
"0.2 LPU/s",
"0.4 LPU/s"
],
"a": 3,
"e": "Net drain = 0.6 − 0.2 = 0.4 LPU/s."
},
{
"q": "How long does a 7 LPU queue take to clear at 0.4 LPU/s?",
"o": [
"28 s",
"17.5 s",
"7 s",
"12 s"
],
"a": 1,
"e": "7 ÷ 0.4 = 17.5 s after the green starts."
},
{
"q": "What is the degree of saturation (DoS)?",
"o": [
"Delay ÷ stops",
"Demand ÷ what the green can clear",
"Green time ÷ cycle time",
"Queue × SATO"
],
"a": 1,
"e": "DoS = (arrivals per cycle + leftover queue) ÷ (effective green × SATO)."
},
{
"q": "Demand is 0.2 × 60 = 12 LPU per cycle and the green can clear 25 × 0.6 = 15 LPU. What is the DoS?",
"o": [
"1.25",
"0.80",
"1.50",
"0.60"
],
"a": 1,
"e": "12 ÷ 15 = 0.80 (80%): below the 90% target, so there is spare green."
},
{
"q": "Why does SCOOT aim for about 90% rather than 100%?",
"o": [
"To save fuel",
"To leave a margin for random surges in traffic",
"Because detectors fail above 90%",
"Because 100% is illegal"
],
"a": 1,
"e": "Traffic varies from cycle to cycle; a 10% margin stops a single busy cycle from building a queue."
},
{
"q": "A link has a DoS of 1.10. What happens?",
"o": [
"The queue grows every cycle",
"There is plenty of spare green",
"There is no traffic",
"The green is exactly used up"
],
"a": 0,
"e": "Above 1.0 more arrives than the green can clear, so the leftover queue grows each cycle."
},
{
"q": "In the queue model, total delay equals…",
"o": [
"The number of stops",
"SATO × green time",
"The area under the queue-over-time line",
"The length of the red"
],
"a": 2,
"e": "Every vehicle-second spent waiting adds to the area; in the example it is 183.75 LPU·s per cycle."
}
]
},
{
"n": 2,
"title": "Key words",
"qs": [
{
"q": "What is <b>effective green</b>?",
"o": [
"The green shown on the signal head, exactly as displayed",
"The green given to the busiest stage only",
"The part of the cycle when the queue really discharges: it starts a start lag after green and runs an end lag into amber",
"The green time minus the whole intergreen"
],
"a": 2,
"e": "Effective green = green − start lag + end lag. DoS uses this, not the displayed green."
},
{
"q": "What is the <b>start lag</b>?",
"o": [
"The few seconds after the light turns green before the queue starts moving at full rate, because drivers react",
"The delay before SCOOT changes the cycle time",
"The amber time at the end of green",
"The time a car takes from the detector to the stop line"
],
"a": 0,
"e": "Drivers need a moment to react and get going, so effective green begins a start lag late (3 s in the course’s SATO animation)."
},
{
"q": "What is the <b>end lag</b>?",
"o": [
"The time the last car waits in the queue",
"The gap between two cycles",
"The extra time after the light turns amber during which drivers keep going through",
"The time the detector takes to send its count"
],
"a": 2,
"e": "Drivers keep crossing during amber, so effective green runs an end lag past the end of the displayed green."
},
{
"q": "What is a <b>residual queue</b>?",
"o": [
"Queue left over at the end of green that carries into the next cycle",
"The queue that the detector measures directly",
"The queue at the end of red",
"The cars waiting on a side road"
],
"a": 0,
"e": "It is added to the next cycle’s demand in the DoS: (arrivals per cycle + residual) ÷ (effective green × SATO)."
},
{
"q": "In the queue model, which vehicles count as <b>stops</b>?",
"o": [
"Only the first car in the queue",
"Only vehicles that arrive in green",
"Every vehicle that crosses the detector",
"Arrivals that meet a red light or a queue"
],
"a": 3,
"e": "Anyone arriving before the queue has cleared has to halt; in the worked example that is 10.5 LPU per cycle."
},
{
"q": "What does the <b>performance index (PI)</b> measure?",
"o": [
"The degree of saturation of the worst link",
"How long the cycle is compared with Webster’s cycle",
"The number of LPUs counted per hour",
"Delay plus K times stops: the score the optimisers try to make as low as possible"
],
"a": 3,
"e": "PI = delay + K × stops; lower is better, and the optimisers compare options using it."
},
{
"q": "In PI = delay + K × stops, what is <b>K</b>?",
"o": [
"The saturation occupancy",
"A weight that sets how much one stop matters compared with delay",
"The cruise time of the link",
"The number of lanes"
],
"a": 1,
"e": "A bigger K makes stops count for more in the PI, so options with fewer stops look better."
},
{
"q": "The model’s delay is given in which unit?",
"o": [
"Vehicles per hour",
"LPU·seconds",
"LPU per second",
"Seconds per cycle"
],
"a": 1,
"e": "Delay is the area under the queue curve: queue (LPU) × time (s), for example 183.75 LPU·s per cycle."
},
{
"q": "What is the <b>saturation flow</b> s of a lane?",
"o": [
"The top rate a standing queue leaves in green, about 1800 veh/h per lane",
"The average flow over a whole day",
"The flow at which the detector stops working",
"The flow of the first car after the light turns green"
],
"a": 0,
"e": "About one car every 2 s per lane on a good lane; SCOOT measures the same idea in LPU/s and calls it SATO."
},
{
"q": "What does the <b>capacity</b> of an approach mean?",
"o": [
"The green time divided by the red time",
"The arrival rate in the peak hour",
"What the approach can carry per hour, s × g ÷ C",
"The longest queue the road can hold"
],
"a": 2,
"e": "Capacity = saturation flow × green ÷ cycle; for example 1800 × 25 ÷ 60 = 750 veh/h."
}
]
},
{
"n": 3,
"title": "Numbers and calculations",
"qs": [
{
"q": "Arrivals are 0.25 LPU/s and effective red lasts 40 s, with no queue at the start. How big is the queue at the end of red?",
"o": [
"15 LPU",
"2.5 LPU",
"10 LPU",
"160 LPU"
],
"a": 2,
"e": "Queue = arrival rate × red = 0.25 × 40 = <b>10 LPU</b>. 160 comes from dividing 40 ÷ 0.25 instead of multiplying."
},
{
"q": "A 10 LPU queue faces green with SATO 0.75 LPU/s while traffic still arrives at 0.25 LPU/s. How long until it clears?",
"o": [
"10 s",
"13.3 s",
"20 s",
"40 s"
],
"a": 2,
"e": "Net drain = 0.75 − 0.25 = 0.5 LPU/s, so 10 ÷ 0.5 = <b>20 s</b>. 13.3 s forgets that cars keep arriving (10 ÷ 0.75)."
},
{
"q": "Arrivals 0.15 LPU/s, cycle 80 s, effective green 40 s, SATO 0.5 LPU/s, no residual. What is the DoS?",
"o": [
"0.60",
"1.67",
"0.50",
"0.30"
],
"a": 0,
"e": "Demand = 0.15 × 80 = 12 LPU; capacity = 40 × 0.5 = 20 LPU; DoS = 12 ÷ 20 = <b>0.60</b>. 1.67 is the ratio upside down."
},
{
"q": "This cycle 15 LPU arrive and 3 LPU were left over from last cycle. Effective green 25 s, SATO 0.8 LPU/s. What is the DoS?",
"o": [
"0.75",
"0.90",
"1.11",
"0.72"
],
"a": 1,
"e": "DoS = (15 + 3) ÷ (25 × 0.8) = 18 ÷ 20 = <b>0.90</b>. 0.75 forgets the residual queue (15 ÷ 20)."
},
{
"q": "Displayed green is 30 s, start lag 3 s, end lag 2 s. What is the effective green?",
"o": [
"29 s",
"31 s",
"35 s",
"25 s"
],
"a": 0,
"e": "Effective green = green − start lag + end lag = 30 − 3 + 2 = <b>29 s</b>. 25 s subtracts both lags."
},
{
"q": "Arrivals 0.2 LPU/s, red 30 s, SATO 0.5 LPU/s, no starting queue. The queue is 6 LPU at the end of red and clears 20 s into green. What is the delay per cycle?",
"o": [
"300 LPU·s",
"60 LPU·s",
"150 LPU·s",
"90 LPU·s"
],
"a": 2,
"e": "Two triangles: ½ × 30 × 6 + ½ × 20 × 6 = 90 + 60 = <b>150 LPU·s</b>. 90 counts only the red part; 300 forgets the ½."
},
{
"q": "An option gives delay 150 LPU·s and 10 LPU of stops, with K = 10. What is its PI?",
"o": [
"100",
"1600",
"250",
"160"
],
"a": 2,
"e": "PI = delay + K × stops = 150 + 10 × 10 = <b>250</b>. 160 forgets the weight K."
},
{
"q": "Course example: arrivals 0.2 LPU/s, red 35 s, queue clears 17.5 s into green. How many LPU are stopped per cycle?",
"o": [
"10.5 LPU",
"12 LPU",
"7 LPU",
"3.5 LPU"
],
"a": 0,
"e": "Stops = everyone who arrives before the queue clears = 0.2 × (35 + 17.5) = <b>10.5 LPU</b>. 7 LPU counts only red arrivals."
},
{
"q": "Course example: s = 1800 veh/h, g = 25 s, C = 60 s, demand 540 veh/h. What is the DoS?",
"o": [
"0.42",
"1.39",
"0.30",
"0.72"
],
"a": 3,
"e": "Capacity = 1800 × 25 ÷ 60 = 750 veh/h; DoS = 540 ÷ 750 = <b>0.72</b>. 1.39 is upside down; 0.30 forgets the green share."
},
{
"q": "Course DoS animation: demand 14.4 LPU, capacity 15 LPU (25 s × 0.6). The split optimiser adds 4 s of green. New DoS?",
"o": [
"0.96",
"0.76",
"0.83",
"0.80"
],
"a": 2,
"e": "New capacity = 15 + 4 × 0.6 = 17.4 LPU; DoS = 14.4 ÷ 17.4 ≈ <b>0.83</b>. 0.76 adds 4 LPU instead of 4 s × SATO."
}
]
},
{
"n": 4,
"title": "What happens if…?",
"qs": [
{
"q": "Arrivals on a link rise but its green stays the same. What happens to the DoS?",
"o": [
"It falls",
"It stays the same",
"It rises",
"It drops to zero"
],
"a": 2,
"e": "More demand over the same capacity: in the course example 0.2 → 0.24 LPU/s moves DoS from 0.80 to 0.96."
},
{
"q": "The split optimiser gives a stage a few seconds more effective green, with the same arrivals. What happens to that link’s DoS?",
"o": [
"It rises, because more cars arrive",
"It doubles",
"It falls, because the green can clear more",
"It stays the same"
],
"a": 2,
"e": "Capacity = effective green × SATO grows, so demand ÷ capacity falls (0.96 → 0.83 in the course animation)."
},
{
"q": "Two lanes have the same queue, but one has a higher SATO. What happens?",
"o": [
"The higher-SATO lane empties sooner and needs less green",
"The higher-SATO lane needs more green",
"Both empty at the same time",
"The higher-SATO lane builds a longer queue in red"
],
"a": 0,
"e": "SATO is the drain rate; a bigger drain clears the same queue in less time."
},
{
"q": "A residual queue is left at the end of green. What happens to next cycle’s DoS, other things equal?",
"o": [
"It goes down, because fewer cars arrive",
"It resets to zero",
"It is unchanged; residuals are ignored",
"It goes up, because the leftover queue is added to the demand"
],
"a": 3,
"e": "DoS = (arrivals per cycle + residual) ÷ (effective green × SATO), so a residual raises the top line."
},
{
"q": "Drivers react more slowly, so the start lag gets longer. What happens?",
"o": [
"Nothing; DoS uses the displayed green",
"Only the red time changes",
"Effective green gets shorter and the DoS rises",
"Effective green gets longer and the DoS falls"
],
"a": 2,
"e": "Effective green = green − start lag + end lag, so a longer start lag cuts capacity and raises DoS."
},
{
"q": "During green, cars arrive faster than SATO. What happens to the queue in green?",
"o": [
"It stays exactly the same size",
"It keeps growing instead of shrinking",
"It clears at once",
"It shrinks faster than usual"
],
"a": 1,
"e": "The queue shrinks at SATO − arrival rate; if that is negative the tub fills even with the plug out."
},
{
"q": "The red is made longer while arrivals stay the same (and green can still clear the queue). What happens to delay per cycle?",
"o": [
"It falls",
"It grows, because the queue gets taller and takes longer to clear",
"It becomes zero",
"It stays the same"
],
"a": 1,
"e": "Both the peak queue and the clearing time grow, so the area under the queue line grows."
},
{
"q": "The weight K in the PI is raised. What happens when the optimisers compare options?",
"o": [
"Stops no longer count",
"The DoS target rises to 100%",
"Options that cause more stops look worse than before",
"Delay no longer counts"
],
"a": 2,
"e": "PI = delay + K × stops; a bigger K makes each stop cost more in the score."
},
{
"q": "The model’s SATO is set higher than the real street’s. What happens to the modelled queue?",
"o": [
"It clears at exactly the same time",
"It never forms",
"It clears earlier than the real queue",
"It clears later than the real queue"
],
"a": 2,
"e": "A bigger modelled drain empties the model tub too soon, so the engineer would turn SATO down during validation."
},
{
"q": "A link has DoS 0.80, under the 90% target. What does this allow SCOOT to do?",
"o": [
"Nothing; DoS under 90% is a fault",
"Give some of its spare green to a busier stage, a few seconds at a time",
"Lengthen this link’s green a lot",
"Switch the junction off"
],
"a": 1,
"e": "Spare green on a quiet link can go to the busiest stage at the junction, in small steps."
}
]
},
{
"n": 5,
"title": "Everyday pictures",
"qs": [
{
"q": "In the bathtub picture of a queue, what is the plug being in?",
"o": [
"The detector",
"The green light",
"The red light",
"The arriving traffic"
],
"a": 2,
"e": "During red the plug is in, so the water (the queue) rises; on green the plug pops out."
},
{
"q": "In the bathtub picture, what is the water level in the tub?",
"o": [
"The number of lanes",
"The cruise time",
"The queue at the stop line",
"The cycle time"
],
"a": 2,
"e": "Water rises in red and drains in green, just like the modelled queue."
},
{
"q": "In the bathtub picture, the tap runs slower than the drain. What happens during green?",
"o": [
"The tub empties",
"The tub overflows",
"The plug goes back in",
"The water level stays the same"
],
"a": 0,
"e": "If arrivals are slower than SATO, the queue shrinks at the difference and clears during green."
},
{
"q": "Where does the simple bathtub picture break down?",
"o": [
"A real queue has a length on the road and can block the junction behind it",
"Real traffic never arrives during green",
"Real queues do not grow in red",
"Real queues drain at no fixed rate at all"
],
"a": 0,
"e": "The basic bathtub ignores the queue’s physical length; that comes back at the Advanced level (congestion)."
},
{
"q": "In the memory palace the bathtub has a gauge painted red above one mark. What does that mark stand for?",
"o": [
"SCOOT’s 90% DoS target",
"The 10–20 s warning",
"The 60 s cycle",
"The SATO value"
],
"a": 0,
"e": "The 90% mark is the DoS target; the water’s area over time is the delay."
},
{
"q": "SCOOT nudges a link’s green as its DoS drifts, like a thermostat. In that picture, what plays the room temperature?",
"o": [
"The modelled DoS of the link",
"The detector cable",
"The colour of the signal",
"The number of junctions in the region"
],
"a": 0,
"e": "A thermostat reacts to the temperature reading; SCOOT reacts to how full the green is and adjusts a few seconds at a time."
},
{
"q": "In the course’s queue chart (red 0–35 s, green 35–60 s), why does the line fall more steeply than it rose?",
"o": [
"Cars stop arriving in green",
"The detector counts twice in green",
"It drains at 0.4 LPU/s but filled at only 0.2 LPU/s",
"The cycle gets shorter in green"
],
"a": 2,
"e": "Fill rate = arrivals 0.2 LPU/s; drain rate = SATO − arrivals = 0.6 − 0.2 = 0.4 LPU/s."
},
{
"q": "In the same queue chart, how long is the queue empty at the end of green?",
"o": [
"0 s",
"7.5 s",
"25 s",
"17.5 s"
],
"a": 1,
"e": "It clears 17.5 s into a 25 s green, so 25 − 17.5 = 7.5 s are empty: spare green."
},
{
"q": "In the degree-of-saturation animation the gauge moves into the red. What brings it back?",
"o": [
"The detector is switched off",
"The split optimiser gives the stage about 4 s more green",
"The cycle is cut in half",
"The arrivals are ignored"
],
"a": 1,
"e": "More green raises capacity: 14.4 ÷ 15.0 = 0.96 becomes 14.4 ÷ 17.4 ≈ 0.83."
},
{
"q": "In the SATO animation two lanes hold the same six-car queue, one with SATO 0.6 LPU/s and one with 1.0 LPU/s. What do you see?",
"o": [
"The 0.6 LPU/s lane empties sooner",
"Both empty together",
"Neither queue moves",
"The 1.0 LPU/s lane empties sooner"
],
"a": 3,
"e": "A bigger plughole drains faster; the slope of the cleared-LPU line is SATO."
}
]
},
{
"n": 6,
"title": "Exam challenge",
"qs": [
{
"q": "Displayed green 27 s, start lag 3 s, end lag 1 s, SATO 0.6 LPU/s, demand 12 LPU per cycle, no residual. What is the DoS?",
"o": [
"0.80",
"0.74",
"1.35",
"0.83"
],
"a": 0,
"e": "Effective green = 27 − 3 + 1 = 25 s; capacity 25 × 0.6 = 15 LPU; DoS = 12 ÷ 15 = <b>0.80</b>. 0.74 wrongly uses the displayed 27 s."
},
{
"q": "Demand is 12 LPU per cycle and SATO is 0.6 LPU/s. What is the shortest effective green that keeps the DoS at 90%?",
"o": [
"About 22.2 s",
"25 s",
"20 s",
"18 s"
],
"a": 0,
"e": "Need 12 ÷ (g × 0.6) = 0.9, so g = 12 ÷ (0.9 × 0.6) ≈ <b>22.2 s</b>. 20 s would give exactly 100%."
},
{
"q": "Every cycle 18 LPU arrive but the green can clear only 15 LPU. Starting with no queue, how big is the residual after 3 cycles?",
"o": [
"3 LPU",
"54 LPU",
"9 LPU",
"6 LPU"
],
"a": 2,
"e": "Each cycle leaves 18 − 15 = 3 LPU more, so 3 × 3 = <b>9 LPU</b>: above 100% the queue grows every cycle."
},
{
"q": "A link sits at DoS exactly 1.00 every cycle. Which statement is right?",
"o": [
"The road is jammed forever",
"There is plenty of spare green",
"The queue grows every cycle",
"The green is just used up; a random surge would leave a residual queue"
],
"a": 3,
"e": "100% is not gridlock; it means no margin. That is why SCOOT aims for about 90%."
},
{
"q": "K = 10. Option A: delay 200 LPU·s, 12 LPU stops. Option B: delay 180 LPU·s, 15 LPU stops. Which does the optimiser prefer?",
"o": [
"Neither; they are equal",
"B, with PI 195 against 212",
"B, because its delay is lower",
"A, with PI 320 against 330"
],
"a": 3,
"e": "PI A = 200 + 10 × 12 = 320; PI B = 180 + 10 × 15 = 330. Lower PI wins, so <b>A</b>. 195 and 212 forget K."
},
{
"q": "Linking to validation: an engineer sees an 18 LPU queue clear at 33 s with a 3 s start lag. What SATO should the model use?",
"o": [
"1.67 LPU/s",
"0.55 LPU/s",
"0.67 LPU/s",
"0.60 LPU/s"
],
"a": 3,
"e": "SATO = queue ÷ (clear time − start lag) = 18 ÷ (33 − 3) = <b>0.60 LPU/s</b>. 0.55 forgets the start lag."
},
{
"q": "s = 1800 veh/h, g = 30 s, C = 90 s, demand 480 veh/h. Capacity and DoS?",
"o": [
"1800 veh/h and 0.27",
"600 veh/h and 0.80",
"900 veh/h and 0.53",
"600 veh/h and 1.25"
],
"a": 1,
"e": "Capacity = 1800 × 30 ÷ 90 = 600 veh/h; DoS = 480 ÷ 600 = <b>0.80</b>."
},
{
"q": "In the course example (0.2 LPU/s, SATO 0.6) the delay is 183.75 LPU·s. If the red were twice as long (70 s) and green could still clear the queue, the delay would be…",
"o": [
"Twice as big (367.5 LPU·s)",
"About four times as big (735 LPU·s)",
"Half as big",
"The same"
],
"a": 1,
"e": "Queue 0.2 × 70 = 14 LPU, clears in 14 ÷ 0.4 = 35 s; delay = ½ × 70 × 14 + ½ × 35 × 14 = 490 + 245 = <b>735</b> = 4 × 183.75. Both triangle sides double."
},
{
"q": "Linking to the cycle optimiser: splits are already balanced but the critical junction stays above about 90%. What does SCOOT do over the next minutes?",
"o": [
"Shortens every green by 4 s",
"Changes the offset once a second",
"Switches to a fixed plan",
"Lengthens the cycle, checking every 5 minutes (2.5 when rising)"
],
"a": 3,
"e": "A longer cycle wastes a smaller share on stage changes, adding capacity; the cycle optimiser runs every 5 min, 2.5 when rising."
},
{
"q": "Last cycle left 1.5 LPU behind. This cycle 12 LPU arrive and the green can clear 15 LPU. What is the DoS, and how does it compare with the target?",
"o": [
"0.70: plenty of spare green",
"0.90: right at SCOOT’s target",
"0.80: well under the target",
"1.10: overloaded"
],
"a": 1,
"e": "DoS = (12 + 1.5) ÷ 15 = 13.5 ÷ 15 = <b>0.90</b>. 0.80 forgets the residual queue."
}
]
}
],
"qs": [
{
"q": "In the bathtub picture of a queue, what is the tap?",
"o": [
"The saturation occupancy",
"The arriving traffic",
"The queue",
"The green light"
],
"a": 1,
"e": "Arrivals pour in all the time; red is the plug; the plughole is the green discharge (SATO)."
},
{
"q": "What is SATO?",
"o": [
"The amber time",
"The average speed on the link",
"Saturation occupancy: how fast a standing queue drains in green",
"The offset between junctions"
],
"a": 2,
"e": "It is measured in LPU per second of green, and checked on site during validation."
},
{
"q": "Arrivals are 0.2 LPU/s and red lasts 35 s. How big is the queue at the end of red?",
"o": [
"5 LPU",
"3.5 LPU",
"12 LPU",
"7 LPU"
],
"a": 3,
"e": "0.2 × 35 = 7 LPU."
},
{
"q": "In green, SATO is 0.6 LPU/s and cars still arrive at 0.2 LPU/s. How fast does the queue shrink?",
"o": [
"0.6 LPU/s",
"0.8 LPU/s",
"0.2 LPU/s",
"0.4 LPU/s"
],
"a": 3,
"e": "Net drain = 0.6 − 0.2 = 0.4 LPU/s."
},
{
"q": "How long does a 7 LPU queue take to clear at 0.4 LPU/s?",
"o": [
"28 s",
"17.5 s",
"7 s",
"12 s"
],
"a": 1,
"e": "7 ÷ 0.4 = 17.5 s after the green starts."
},
{
"q": "What is the degree of saturation (DoS)?",
"o": [
"Delay ÷ stops",
"Demand ÷ what the green can clear",
"Green time ÷ cycle time",
"Queue × SATO"
],
"a": 1,
"e": "DoS = (arrivals per cycle + leftover queue) ÷ (effective green × SATO)."
},
{
"q": "Demand is 0.2 × 60 = 12 LPU per cycle and the green can clear 25 × 0.6 = 15 LPU. What is the DoS?",
"o": [
"1.25",
"0.80",
"1.50",
"0.60"
],
"a": 1,
"e": "12 ÷ 15 = 0.80 (80%): below the 90% target, so there is spare green."
},
{
"q": "Why does SCOOT aim for about 90% rather than 100%?",
"o": [
"To save fuel",
"To leave a margin for random surges in traffic",
"Because detectors fail above 90%",
"Because 100% is illegal"
],
"a": 1,
"e": "Traffic varies from cycle to cycle; a 10% margin stops a single busy cycle from building a queue."
},
{
"q": "A link has a DoS of 1.10. What happens?",
"o": [
"The queue grows every cycle",
"There is plenty of spare green",
"There is no traffic",
"The green is exactly used up"
],
"a": 0,
"e": "Above 1.0 more arrives than the green can clear, so the leftover queue grows each cycle."
},
{
"q": "In the queue model, total delay equals…",
"o": [
"The number of stops",
"SATO × green time",
"The area under the queue-over-time line",
"The length of the red"
],
"a": 2,
"e": "Every vehicle-second spent waiting adds to the area; in the example it is 183.75 LPU·s per cycle."
}
]
},
"5": {
"title": "Validation",
"quizzes": [
{
"n": 1,
"title": "Basics",
"qs": [
{
"q": "What is validation in SCOOT?",
"o": [
"Tuning each link’s model so it matches what happens on the street",
"Checking the signal bulbs",
"Counting accidents",
"Installing new loops"
],
"a": 0,
"e": "The model is only as good as its settings, and every street is different."
},
{
"q": "The model and the engineer’s stopwatch disagree about when the queue clears. Which is right?",
"o": [
"The average of the two",
"The street (the stopwatch)",
"Neither",
"The model"
],
"a": 1,
"e": "The street is always right: the model is changed to match it."
},
{
"q": "Which formula gives SATO from a stopwatch measurement?",
"o": [
"SATO = (clear time + start lag) ÷ queue",
"SATO = queue × start lag",
"SATO = clear time ÷ queue",
"SATO = queue ÷ (clear time − start lag)"
],
"a": 3,
"e": "Take away the start lag, then divide the queue by the time it took to drain."
},
{
"q": "A 19.5 LPU queue clears 36 s after green starts; the start lag is 3 s. What is SATO?",
"o": [
"0.81 LPU/s",
"0.67 LPU/s",
"0.54 LPU/s",
"0.59 LPU/s"
],
"a": 3,
"e": "19.5 ÷ (36 − 3) = 19.5 ÷ 33 = 0.59 LPU/s."
},
{
"q": "With SATO set to 0.67 LPU/s, when does the model say that 19.5 LPU queue clears (start lag 3 s)?",
"o": [
"After 39 s",
"After about 32 s",
"After 36 s",
"After about 29 s"
],
"a": 1,
"e": "3 + 19.5 ÷ 0.67 = 3 + 29.1 = 32.1 s: 4 s too early compared with the street."
},
{
"q": "What goes wrong if SATO is set too high?",
"o": [
"SCOOT stops working",
"The cycle doubles",
"The model thinks queues clear sooner, gives too little green, and real queues grow",
"SCOOT gives far too much green"
],
"a": 2,
"e": "An optimistic plughole means the model under-estimates how much green the link needs."
},
{
"q": "What is the start lag?",
"o": [
"The time drivers take to get going after the green starts",
"The length of the cycle",
"The amber time",
"The travel time between junctions"
],
"a": 0,
"e": "The first cars react and accelerate before the queue flows at full rate."
},
{
"q": "Which of these is NOT a setting checked during validation?",
"o": [
"Journey (cruise) time",
"The colour of the signal heads",
"Saturation occupancy (SATO)",
"Start and end lags"
],
"a": 1,
"e": "Engineers also check the maximum queue clear time on long links."
},
{
"q": "Which street features can lower SATO?",
"o": [
"Freshly painted markings",
"Wide straight lanes",
"Extra detectors",
"Narrow lanes, uphill gradients, parking and turning traffic"
],
"a": 3,
"e": "Anything that slows the queue leaving the stop line lowers the drain rate."
},
{
"q": "Which analogy fits validation best?",
"o": [
"Buying a new car",
"Reading a map",
"Tuning a guitar by ear until it matches a tuning fork",
"Painting a road"
],
"a": 2,
"e": "A well-built guitar still plays wrong notes until it is tuned; a well-built model needs tuning to its street."
}
]
},
{
"n": 2,
"title": "Key words",
"qs": [
{
"q": "What does <b>SATO</b> (saturation occupancy) describe?",
"o": [
"How many cars arrive at the detector each cycle",
"The share of the cycle that is green",
"The time from the detector to the stop line",
"How fast a standing queue drains across the stop line in green, in LPU per second"
],
"a": 3,
"e": "SATO is the queue discharge rate in LPU/s: the size of the plughole in the bathtub picture."
},
{
"q": "What are the units of SATO?",
"o": [
"Percent",
"Vehicles per hour per cycle",
"LPU per second",
"Seconds"
],
"a": 2,
"e": "SATO is measured in LPU/s; the lab values are 0.67 LPU/s (main road) and 0.89 LPU/s (side road) per lane."
},
{
"q": "What is the <b>cruise time</b> of a link?",
"o": [
"How long a queue takes to clear",
"The time between two cycles",
"How long the green lasts",
"How long a car takes to drive from the detector to the stop line"
],
"a": 3,
"e": "Cruise time T is the detector-to-stop-line journey time, for example 140 m at 14 m/s gives 10 s."
},
{
"q": "What is the <b>end lag</b>?",
"o": [
"The time drivers take to get going after the green starts",
"The extra time traffic keeps crossing the stop line after the green ends, into the amber",
"The delay before SCOOT changes the cycle",
"The all-red time between stages"
],
"a": 1,
"e": "Effective green starts a start lag late and runs an end lag into amber; in Lab F2 the end lag is 4 s."
},
{
"q": "How does <b>effective green</b> differ from displayed green?",
"o": [
"It is the green shown to pedestrians",
"It includes the whole intergreen",
"It is always exactly the same as displayed green",
"It starts a start lag late and runs an end lag into the amber"
],
"a": 3,
"e": "The queue only flows at SATO once drivers react, and some keep going into the amber."
},
{
"q": "Validation sets cruise time, SATO, start lag, end lag and one more setting. Which?",
"o": [
"The colour of the detector loops",
"The optimiser’s −4/0/+4 s trial steps",
"The maximum queue clear time",
"The target degree of saturation"
],
"a": 2,
"e": "The five street-dependent settings are cruise time, SATO, start lag, end lag and maximum queue clear time."
},
{
"q": "In the validation formulas, what is the <b>queue clear time</b>?",
"o": [
"The time after green starts until the queue that was standing at the start of green has gone",
"The time between two detector readings",
"The time a single car takes to cross the loop",
"The length of the red period"
],
"a": 0,
"e": "Queue clear time = start lag + queue ÷ SATO, for a queue standing at the start of green."
},
{
"q": "What is the <b>model queue</b> in SCOOT?",
"o": [
"The queue SCOOT calculates from upstream detector counts, without ever seeing it",
"A queue photographed by a camera at the stop line",
"The longest queue ever recorded on the link",
"A queue of cars waiting for the detector to be repaired"
],
"a": 0,
"e": "SCOOT never sees the real queue; it models it, which is why the model must be checked against the street."
},
{
"q": "What is <b>commissioning</b> a link?",
"o": [
"Buying the signal heads",
"Setting a link up before it goes live, when the engineer compares the model with the street",
"Choosing the cycle time once a year",
"Paying the contractor who laid the loops"
],
"a": 1,
"e": "When a link is commissioned, an engineer stands at the stop line and compares what they see with what SCOOT shows."
},
{
"q": "How is SATO related to <b>saturation flow</b>?",
"o": [
"It is the saturation flow multiplied by the cycle time",
"It is the arrival rate at the detector",
"It is the same idea (the top discharge rate of a queue) measured in LPU per second",
"They are unrelated quantities"
],
"a": 2,
"e": "Saturation flow is about 1800 veh/h per lane; SCOOT measures the same top rate in LPU/s and calls it SATO."
}
]
},
{
"n": 3,
"title": "Numbers and calculations",
"qs": [
{
"q": "The course’s ‘try it’ example: a queue of 18 LPU clears on the street 27 s after green starts; start lag 3 s. What should SATO be?",
"o": [
"1.33 LPU/s",
"0.75 LPU/s",
"0.60 LPU/s",
"0.67 LPU/s"
],
"a": 1,
"e": "SATO = 18 ÷ (27 − 3) = 18 ÷ 24 = 0.75 LPU/s. Forgetting the start lag gives 18 ÷ 27 = 0.67; 1.33 is the ratio upside down."
},
{
"q": "In the same ‘try it’ example the model cleared the 18 LPU queue at 30 s (start lag 3 s). What SATO was the model using?",
"o": [
"About 0.67 LPU/s",
"0.60 LPU/s",
"0.75 LPU/s",
"1.5 LPU/s"
],
"a": 0,
"e": "SATO = 18 ÷ (30 − 3) = 18 ÷ 27 ≈ 0.67 LPU/s: too low, so the model cleared later than the street."
},
{
"q": "Lab F2 measured 1.95 LPU per vehicle. How many LPU is a queue of 10 cars?",
"o": [
"19.5 LPU",
"10 LPU",
"29.5 LPU",
"1.95 LPU"
],
"a": 0,
"e": "10 × 1.95 = 19.5 LPU: the queue used in the course’s stopwatch example."
},
{
"q": "The course’s SATO changed from 0.67 to 0.59 LPU/s after validation. Roughly what percentage change is that?",
"o": [
"About 12%",
"About 88%",
"About 8%",
"About 4%"
],
"a": 0,
"e": "(0.67 − 0.59) ÷ 0.67 = 0.08 ÷ 0.67 ≈ 0.12 = 12%. 8% would use 0.08 as if it were a percentage."
},
{
"q": "On the Lab F2 side road (SATO 0.89 LPU/s, start lag 3 s), when does a 19.5 LPU queue clear?",
"o": [
"About 22 s",
"About 25 s after green starts",
"About 17 s",
"About 32 s"
],
"a": 1,
"e": "3 + 19.5 ÷ 0.89 = 3 + 21.9 ≈ 24.9 s. 22 s forgets the start lag; 32 s uses the main-road SATO 0.67."
},
{
"q": "A queue of 12 LPU waits at red. SATO is 0.6 LPU/s and the start lag is 2 s. When does it clear?",
"o": [
"22 s after green starts",
"20 s",
"9.2 s",
"7.2 s"
],
"a": 0,
"e": "Clear time = 2 + 12 ÷ 0.6 = 2 + 20 = 22 s. 20 s forgets the start lag; 9.2 s multiplies instead of dividing."
},
{
"q": "A 20 LPU queue clears on the street 28 s after green starts; the start lag is 3 s. What is SATO?",
"o": [
"0.65 LPU/s",
"1.25 LPU/s",
"0.8 LPU/s",
"0.71 LPU/s"
],
"a": 2,
"e": "SATO = 20 ÷ (28 − 3) = 20 ÷ 25 = 0.8 LPU/s. 0.71 forgets the start lag (20 ÷ 28); 1.25 is upside down."
},
{
"q": "A link is 162 m from detector to stop line and cars cruise at the lab’s 13.5 m/s. What is the cruise time?",
"o": [
"13.5 s",
"2187 s",
"8.3 s",
"12 s"
],
"a": 3,
"e": "Cruise time = distance ÷ speed = 162 ÷ 13.5 = 12 s. Multiplying gives the nonsense 2187."
},
{
"q": "Displayed green is 30 s, with the Lab F2 lags (start 3 s, end 4 s). What is the effective green?",
"o": [
"37 s",
"23 s",
"30 s",
"31 s"
],
"a": 3,
"e": "Effective green = 30 − 3 + 4 = 31 s. 23 s subtracts both lags; 37 s adds both."
},
{
"q": "The model uses SATO 0.6 LPU/s for a 15 LPU queue (start lag 3 s) and clears it at 28 s, but the street clears at 33 s. What should SATO be?",
"o": [
"0.5 LPU/s",
"0.6 LPU/s",
"0.45 LPU/s",
"2.0 LPU/s"
],
"a": 0,
"e": "Model: 3 + 15 ÷ 0.6 = 28 s, 5 s too early. Corrected SATO = 15 ÷ (33 − 3) = 15 ÷ 30 = 0.5 LPU/s. 0.45 forgets the start lag."
}
]
},
{
"n": 4,
"title": "What happens if…?",
"qs": [
{
"q": "The model’s queue empties earlier than the real queue. What should the engineer do?",
"o": [
"Turn SATO up",
"Turn SATO down: the model thinks traffic leaves faster than it does",
"Leave it: the model is right",
"Raise the target DoS"
],
"a": 1,
"e": "Clearing early means the model’s plughole is too big, so SATO is too high and must be reduced."
},
{
"q": "The model’s queue is still showing after the real queue has gone. What does that mean?",
"o": [
"The cycle time is too short",
"SATO is too low and should be raised",
"SATO is too high and should be lowered",
"The detector is counting twice"
],
"a": 1,
"e": "If the model empties later than the street, it thinks traffic leaves more slowly than it really does."
},
{
"q": "If the model’s SATO is set too low, what happens to the green that link receives?",
"o": [
"Nothing changes",
"The link gets too little green",
"The link is skipped every other cycle",
"The model thinks queues clear slowly, so it tends to give that link more green than it needs"
],
"a": 3,
"e": "Lower SATO makes the link look busier (higher DoS), so green that other movements could use is spent here."
},
{
"q": "Parking is added along a link and its lanes get narrower. What should happen?",
"o": [
"The link should be re-validated, because SATO is likely to fall",
"Nothing: SCOOT parameters never change",
"SATO should be raised",
"The cruise time should be set to zero"
],
"a": 0,
"e": "Narrow lanes and parking slow the discharge; unlike a guitar, a link needs re-tuning when the layout changes."
},
{
"q": "The start lag on a link is really 5 s, not 3 s. With the same queue and SATO, how does the real clear time compare with the model’s?",
"o": [
"It is 2 s later",
"It is 2 s earlier",
"It is the same",
"It is 5 s later"
],
"a": 0,
"e": "Clear time = start lag + queue ÷ SATO, so adding 2 s to the start lag adds 2 s to the clear time."
},
{
"q": "The queue at the start of green doubles, but SATO and start lag stay the same. What happens to the clear time?",
"o": [
"The clear time does not change",
"The whole clear time, including the start lag, doubles",
"The drain part (queue ÷ SATO) doubles; the start lag stays the same",
"The clear time halves"
],
"a": 2,
"e": "For 19.5 LPU at 0.67: 3 + 29.1 = 32.1 s; for 39 LPU: 3 + 58.2 = 61.2 s. Only the drain part doubles."
},
{
"q": "With the same arrivals and effective green, SATO in the model is raised. What happens to the calculated DoS?",
"o": [
"It stays exactly the same",
"It becomes negative",
"It falls",
"It rises"
],
"a": 2,
"e": "DoS = (arrivals + residual) ÷ (effective green × SATO); a bigger SATO makes the denominator bigger."
},
{
"q": "The end lag is longer than the model assumes. What does the model get wrong?",
"o": [
"It over-estimates the cruise time",
"It makes the cycle too long by exactly the end lag",
"It under-estimates the effective green, so it thinks less traffic can clear each cycle",
"It counts too many cars at the detector"
],
"a": 2,
"e": "Effective green runs an end lag into amber; a longer end lag means more real green than the model thinks."
},
{
"q": "The cruise time in the model is shorter than the real drive from detector to stop line. What happens?",
"o": [
"The model expects cars at the stop line before they really arrive, so its queue timing is wrong",
"Nothing, cruise time is not used by the model",
"The detector reads fewer times a second",
"SATO automatically corrects itself"
],
"a": 0,
"e": "Cruise time tells the model when detected cars reach the stop line, so it must match the street."
},
{
"q": "SATO is wrong by about 12% (0.67 instead of 0.59 LPU/s) on the 19.5 LPU queue. What is the effect?",
"o": [
"The cycle time doubles",
"The detector stops working",
"The model’s clear time is about 4 s out, enough to give big errors in delay and DoS",
"Almost no effect: 12% is too small to matter"
],
"a": 2,
"e": "32.1 s instead of 36 s: small parameter errors give big errors in delay and DoS."
}
]
},
{
"n": 5,
"title": "Everyday pictures",
"qs": [
{
"q": "In the guitar-tuning picture of validation, what plays the part of the tuning fork?",
"o": [
"The optimiser",
"The detector loop",
"The real street",
"The SCOOT model"
],
"a": 2,
"e": "The model is the guitar; the street is the tuning fork you tune it to."
},
{
"q": "In the guitar picture, what is “turning the peg”?",
"o": [
"Changing the cycle time every second",
"Moving the detector loop",
"Changing a model setting such as SATO until the model matches the street",
"Switching the signal off"
],
"a": 2,
"e": "You pluck, listen and turn the peg; the engineer watches, compares and adjusts SATO and the lags."
},
{
"q": "Where does the guitar analogy break down?",
"o": [
"Validation uses a tuning fork on the street",
"A guitar stays in tune for weeks; a link may need re-validating whenever lanes, layout or parking change",
"A guitar never needs tuning at all",
"A guitar has no strings"
],
"a": 1,
"e": "Street changes alter SATO and lags, so validation is not a once-and-forever job."
},
{
"q": "“A perfectly built guitar still plays wrong notes if nobody tunes it.” What does this say about SCOOT?",
"o": [
"Even a well-designed SCOOT performs poorly if its links are not validated",
"Only new junctions need SCOOT",
"SCOOT must be rebuilt every year",
"SCOOT works best with no detectors"
],
"a": 0,
"e": "Poor validation is the most common reason SCOOT underperforms."
},
{
"q": "In the memory palace guitar shop, the SATO peg has two small pegs labelled 3 and 4. What do they stand for?",
"o": [
"Start lag 3 s and end lag 4 s",
"SATO 3 and 4 LPU/s",
"3 cars and 4 buses",
"A 3 s cycle and a 4 s cycle"
],
"a": 0,
"e": "The Lab F2 lags were a start lag of 3 s and an end lag of 4 s."
},
{
"q": "In the memory palace, the engineer holds a stopwatch in her teeth. What does the stopwatch stand for?",
"o": [
"The cycle optimiser’s 5-minute timer",
"The intergreen",
"The observed queue clear time on the street",
"The detector reading 4 times a second"
],
"a": 2,
"e": "The stopwatch measures when the real queue clears, which is compared with the model."
},
{
"q": "In the bathtub picture of a queue, what does SATO correspond to?",
"o": [
"The size of the tub",
"How fast the plughole drains the tub when the plug is out (green)",
"The tap’s flow into the tub",
"The colour of the water"
],
"a": 1,
"e": "Arrivals are the tap; in green the plughole drains the queue at SATO."
},
{
"q": "In the SATO animation, the line of cleared LPU starts flat and then rises steadily. What is the slope of the steady part?",
"o": [
"The start lag",
"The arrival rate at the detector",
"The cycle time",
"SATO"
],
"a": 3,
"e": "The caption says the slope of the cleared-LPU line is SATO; the flat start is the 3 s start lag."
},
{
"q": "The SATO animation shows two lanes with the same six-car queue: SATO 0.6 LPU/s and 1.0 LPU/s. Which lane needs less green?",
"o": [
"The 0.6 LPU/s lane",
"The 1.0 LPU/s lane: it empties sooner",
"Neither lane needs any green",
"Both need exactly the same green"
],
"a": 1,
"e": "A bigger SATO drains the same queue faster (a car every 2 s instead of every 3.3 s)."
},
{
"q": "In the Lab F1 figure, the SCOOT model queue follows SUMO’s queue but empties a few seconds later. Why?",
"o": [
"SCOOT’s detectors are broken",
"The model sees the real queue with a camera",
"SUMO uses a different cycle time",
"SUMO stops counting a car as queued the moment it starts moving"
],
"a": 3,
"e": "The model never sees the real queue, yet it follows it in timing and size; the small gap is about how SUMO counts."
}
]
},
{
"n": 6,
"title": "Exam challenge",
"qs": [
{
"q": "Arrivals plus residual are 18 LPU per cycle and effective green is 30 s. With the old SATO 0.67 the DoS is about 90%. What is it with the validated SATO 0.59 LPU/s?",
"o": [
"About 59%",
"About 102%: the link is really over capacity",
"About 79%",
"About 90%"
],
"a": 1,
"e": "18 ÷ (30 × 0.67) = 18 ÷ 20.1 ≈ 0.90; 18 ÷ (30 × 0.59) = 18 ÷ 17.7 ≈ 1.02. The wrong SATO hid an overload."
},
{
"q": "A colleague says: “The model clears early, so let’s lower the target DoS to give more green.” What is the best reply?",
"o": [
"Good idea: changing the target is the normal fix",
"Ignore the stopwatch; the model is right",
"Fix the model first: correct SATO, because every decision is built on the queue picture",
"Change the optimiser’s trial steps instead"
],
"a": 2,
"e": "Do not ‘fix’ a model by changing the target DoS or the optimiser. Validate the model first."
},
{
"q": "A queue of 10 cars (1.95 LPU each) has SATO 0.65 LPU/s and start lag 3 s. When does it clear?",
"o": [
"30 s",
"33 s after green starts",
"18 s",
"15.4 s"
],
"a": 1,
"e": "Queue = 10 × 1.95 = 19.5 LPU; clear time = 3 + 19.5 ÷ 0.65 = 3 + 30 = 33 s. 30 s forgets the start lag."
},
{
"q": "A 19.5 LPU queue drains on the main road (SATO 0.67) and on the side road (SATO 0.89). How much longer does the drain take on the main road?",
"o": [
"About 29 s",
"About 22 s",
"About 0.2 s",
"About 7 s"
],
"a": 3,
"e": "19.5 ÷ 0.67 ≈ 29.1 s; 19.5 ÷ 0.89 ≈ 21.9 s; difference ≈ 7.2 s. The start lag is the same on both, so it cancels."
},
{
"q": "Linking to group 3: a link is 135 m long at the lab cruise speed 13.5 m/s. What is the cruise time, and the Robertson F (α = 0.35, β = 0.8)?",
"o": [
"T = 13.5 s, F = 0.8",
"T = 10 s, F = 0.35",
"T = 1822 s, F ≈ 0",
"T = 10 s, F ≈ 0.263"
],
"a": 3,
"e": "T = 135 ÷ 13.5 = 10 s; F = 1 ÷ (1 + 0.35 × 0.8 × 10) = 1 ÷ 3.8 ≈ 0.263. A wrong cruise time would also give a wrong F."
},
{
"q": "Displayed green is 25 s, lags are 3 s and 4 s, and validated SATO is 0.59 LPU/s. About how many LPU can the green clear?",
"o": [
"About 13.0 LPU",
"About 15.3 LPU",
"About 14.8 LPU",
"About 44 LPU"
],
"a": 1,
"e": "Effective green = 25 − 3 + 4 = 26 s; 26 × 0.59 ≈ 15.3 LPU. Using 25 s gives 14.8; dividing gives 44."
},
{
"q": "Why can’t one SATO value be copied to every link in a town?",
"o": [
"SCOOT forbids two links having the same number",
"SATO depends only on the cycle time",
"SATO depends on lane width, gradient, turning traffic and parking, which differ from street to street",
"SATO changes every second automatically"
],
"a": 2,
"e": "That is why Lab F2 found 0.67 on the main road but 0.89 on the side road."
},
{
"q": "Which observation at the stop line shows the model’s SATO is too high?",
"o": [
"The real queue clears before the model’s",
"The model shows the queue gone while real cars are still queuing",
"The signal shows amber",
"Model and street clear at the same moment"
],
"a": 1,
"e": "If the model empties first, it thinks traffic leaves faster than it does, so SATO must come down."
},
{
"q": "If SATO is left too high, how does the real street suffer?",
"o": [
"The link is given too little green and real queues grow, even though the model looks fine",
"The detectors stop counting",
"Drivers get too much green and roads stay empty",
"The offset optimiser stops running"
],
"a": 0,
"e": "SCOOT trusts its model queue; an optimistic drain rate under-estimates the green needed."
},
{
"q": "An engineer measures a 24 LPU queue clearing in 33 s (start lag 3 s), while the model uses 0.67 LPU/s. What is the new SATO, and was the old value too high or too low?",
"o": [
"0.8 LPU/s; the old value was too low",
"0.8 LPU/s; the old value was too high",
"1.25 LPU/s; the old value was too high",
"0.73 LPU/s; the old value was too low"
],
"a": 0,
"e": "SATO = 24 ÷ (33 − 3) = 24 ÷ 30 = 0.8 LPU/s, above 0.67, so the model was clearing too late. 0.73 forgets the start lag."
}
]
}
],
"qs": [
{
"q": "What is validation in SCOOT?",
"o": [
"Tuning each link’s model so it matches what happens on the street",
"Checking the signal bulbs",
"Counting accidents",
"Installing new loops"
],
"a": 0,
"e": "The model is only as good as its settings, and every street is different."
},
{
"q": "The model and the engineer’s stopwatch disagree about when the queue clears. Which is right?",
"o": [
"The average of the two",
"The street (the stopwatch)",
"Neither",
"The model"
],
"a": 1,
"e": "The street is always right: the model is changed to match it."
},
{
"q": "Which formula gives SATO from a stopwatch measurement?",
"o": [
"SATO = (clear time + start lag) ÷ queue",
"SATO = queue × start lag",
"SATO = clear time ÷ queue",
"SATO = queue ÷ (clear time − start lag)"
],
"a": 3,
"e": "Take away the start lag, then divide the queue by the time it took to drain."
},
{
"q": "A 19.5 LPU queue clears 36 s after green starts; the start lag is 3 s. What is SATO?",
"o": [
"0.81 LPU/s",
"0.67 LPU/s",
"0.54 LPU/s",
"0.59 LPU/s"
],
"a": 3,
"e": "19.5 ÷ (36 − 3) = 19.5 ÷ 33 = 0.59 LPU/s."
},
{
"q": "With SATO set to 0.67 LPU/s, when does the model say that 19.5 LPU queue clears (start lag 3 s)?",
"o": [
"After 39 s",
"After about 32 s",
"After 36 s",
"After about 29 s"
],
"a": 1,
"e": "3 + 19.5 ÷ 0.67 = 3 + 29.1 = 32.1 s: 4 s too early compared with the street."
},
{
"q": "What goes wrong if SATO is set too high?",
"o": [
"SCOOT stops working",
"The cycle doubles",
"The model thinks queues clear sooner, gives too little green, and real queues grow",
"SCOOT gives far too much green"
],
"a": 2,
"e": "An optimistic plughole means the model under-estimates how much green the link needs."
},
{
"q": "What is the start lag?",
"o": [
"The time drivers take to get going after the green starts",
"The length of the cycle",
"The amber time",
"The travel time between junctions"
],
"a": 0,
"e": "The first cars react and accelerate before the queue flows at full rate."
},
{
"q": "Which of these is NOT a setting checked during validation?",
"o": [
"Journey (cruise) time",
"The colour of the signal heads",
"Saturation occupancy (SATO)",
"Start and end lags"
],
"a": 1,
"e": "Engineers also check the maximum queue clear time on long links."
},
{
"q": "Which street features can lower SATO?",
"o": [
"Freshly painted markings",
"Wide straight lanes",
"Extra detectors",
"Narrow lanes, uphill gradients, parking and turning traffic"
],
"a": 3,
"e": "Anything that slows the queue leaving the stop line lowers the drain rate."
},
{
"q": "Which analogy fits validation best?",
"o": [
"Buying a new car",
"Reading a map",
"Tuning a guitar by ear until it matches a tuning fork",
"Painting a road"
],
"a": 2,
"e": "A well-built guitar still plays wrong notes until it is tuned; a well-built model needs tuning to its street."
}
]
},
"6": {
"title": "SCOOT vs others",
"quizzes": [
{
"n": 1,
"title": "Basics",
"qs": [
{
"q": "How does a fixed-time signal decide its green?",
"o": [
"It follows a stored plan",
"It waits for pedestrians",
"It uses stop-line detectors",
"It runs a model fed by upstream detectors"
],
"a": 0,
"e": "Fixed-time plans are often prepared off-line, for example with Webster’s formula or TRANSYT."
},
{
"q": "How does an actuated signal decide its green?",
"o": [
"It copies its neighbour",
"It extends the green while cars keep arriving at stop-line loops, and ends it on a gap",
"It never changes",
"It runs a model of the whole region"
],
"a": 1,
"e": "Actuation reacts to the traffic in front of it, but only locally."
},
{
"q": "Which description fits SCOOT?",
"o": [
"Upstream loops feed a model; small frequent changes; coordinated junctions",
"A stored plan only",
"One loop at the stop line, no model",
"Random timings"
],
"a": 0,
"e": "SCOOT predicts from upstream and adapts split, cycle and offset across a region."
},
{
"q": "In Lab F3 (one junction in SUMO), which controller had the lowest mean delay?",
"o": [
"Actuated",
"SCOOT",
"All the same",
"Fixed time"
],
"a": 1,
"e": "Fixed 18.96 s, actuated 14.48 s, SCOOT 12.79 s per vehicle."
},
{
"q": "SCOOT 12.79 s against fixed time 18.96 s. About how much less delay is that?",
"o": [
"33%",
"12%",
"25%",
"50%"
],
"a": 0,
"e": "(18.96 − 12.79) ÷ 18.96 = 6.17 ÷ 18.96 ≈ 0.33."
},
{
"q": "SCOOT 12.79 s against actuated 14.48 s. About how much less delay?",
"o": [
"33%",
"20%",
"5%",
"12%"
],
"a": 3,
"e": "(14.48 − 12.79) ÷ 14.48 = 1.69 ÷ 14.48 ≈ 0.12."
},
{
"q": "In the four-junction corridor run, which controller had slightly less mean delay?",
"o": [
"Actuated (29.1 s vs SCOOT 30.4 s)",
"All equal",
"Fixed time",
"SCOOT"
],
"a": 0,
"e": "SCOOT is usually better, not always: here actuation edged it on mean delay."
},
{
"q": "In that corridor run, what was SCOOT’s clearest advantage?",
"o": [
"It used the shortest cycle",
"It needed no detectors",
"It was cheapest",
"Fewer stops and much less bus delay"
],
"a": 3,
"e": "Stops 1.10 vs 1.15 per vehicle, and bus delay 22.9 s vs 38.0 s."
},
{
"q": "Where might a simple fixed or actuated controller be good enough?",
"o": [
"Where many buses need priority",
"On a corridor with closely spaced junctions",
"In a busy city-centre grid",
"At an isolated, lightly used junction"
],
"a": 3,
"e": "Adaptive control pays off most where traffic changes and junctions interact."
},
{
"q": "What does SCOOT need in order to work well?",
"o": [
"A fixed cycle",
"GPS in every car",
"No pedestrians",
"Working detectors and a validated model"
],
"a": 3,
"e": "With faulty loops or untuned settings the model’s predictions — and the timings — go wrong."
}
]
},
{
"n": 2,
"title": "Key words",
"qs": [
{
"q": "What is <b>TRANSYT</b>?",
"o": [
"An off-line design program for fixed-time network plans",
"SCOOT’s cycle optimiser",
"A loop placed at the stop line",
"A type of actuated controller"
],
"a": 0,
"e": "TRANSYT designs fixed plans for networks off-line, using the same profile and dispersion model as SCOOT."
},
{
"q": "Why is SCOOT often called an “on-line TRANSYT”?",
"o": [
"It only works where TRANSYT plans already exist",
"It uses TRANSYT’s profile and dispersion model, but runs it live on detector data",
"It was invented by the TRANSYT team as a joke",
"It downloads a new TRANSYT plan every hour"
],
"a": 1,
"e": "TRANSYT does the modelling once, off-line; SCOOT does the same kind of modelling continuously, on-line."
},
{
"q": "In Webster’s formula C₀ = (1.5 L + 5) ÷ (1 − Y), what is <b>L</b>?",
"o": [
"The number of lanes",
"The lost time per cycle",
"The loop length",
"The length of the link"
],
"a": 1,
"e": "L is the lost time per cycle (seconds when nobody moves well, mostly in the intergreens)."
},
{
"q": "In Webster’s formula, what is <b>Y</b>?",
"o": [
"The number of vehicles per cycle",
"The yellow (amber) time",
"The target degree of saturation",
"The sum of the critical flow ratios q/s"
],
"a": 3,
"e": "Each stage’s critical flow ratio y = q/s; Y adds them up."
},
{
"q": "What is the <b>flow ratio</b> y of an approach?",
"o": [
"Its saturation flow divided by its flow, s/q",
"Its green divided by the cycle, g/C",
"Its delay divided by its stops",
"Its flow divided by its saturation flow, q/s"
],
"a": 3,
"e": "y = q/s says what share of the time the approach needs green to keep up."
},
{
"q": "What does C₀ mean?",
"o": [
"The cycle at time zero",
"The offset between two junctions",
"Webster’s optimum cycle time for the given flows",
"The capacity of the busiest lane"
],
"a": 2,
"e": "C₀ is the cycle length Webster’s formula recommends."
},
{
"q": "In actuated control, what is a <b>gap</b>?",
"o": [
"The all-red time between stages",
"The space between two junctions",
"A long enough time between vehicles at the stop-line loop to end the green",
"A missing detector reading"
],
"a": 2,
"e": "An actuated signal extends the green while cars keep arriving and ends it when the gap between them gets too long."
},
{
"q": "What is an <b>isolated</b> junction?",
"o": [
"A junction with no traffic",
"A signalled junction too far from its neighbours to need coordinating with them",
"A junction that runs only at night",
"A junction where every loop is broken"
],
"a": 1,
"e": "At an isolated junction there is no green wave to keep, so SCOOT’s coordination advantage mostly disappears."
},
{
"q": "What is <b>plan selection</b>?",
"o": [
"SCOOT’s small edits to the running plan",
"Swapping between whole stored plans, an older idea",
"Choosing where to put the loop",
"Picking the stage with the highest DoS"
],
"a": 1,
"e": "SCOOT edits the running (elastic) plan; plan selection swaps whole stored plans."
},
{
"q": "Which measure did Lab F3 use to compare the three controllers?",
"o": [
"Cycle length in minutes",
"Mean delay per vehicle, in seconds",
"Number of loops used",
"Fuel price"
],
"a": 1,
"e": "Lab F3 compared mean delay per vehicle: 18.96, 14.48 and 12.79 s."
}
]
},
{
"n": 3,
"title": "Numbers and calculations",
"qs": [
{
"q": "Course example: L = 10 s, y(A) = 0.35, y(B) = 0.25. What is Webster’s C₀?",
"o": [
"50 s",
"100 s",
"33 s",
"40 s"
],
"a": 0,
"e": "Y = 0.60; C₀ = (1.5 × 10 + 5) ÷ (1 − 0.60) = 20 ÷ 0.40 = 50 s. 33 s forgets the “1 −”; 100 s uses 2 × L."
},
{
"q": "Same example (C₀ = 50 s, L = 10 s, Y = 0.60). How much effective green does the main road (y = 0.35) get?",
"o": [
"29.2 s",
"16.7 s",
"23.3 s",
"17.5 s"
],
"a": 2,
"e": "Green to share = 50 − 10 = 40 s; 40 × 0.35 ÷ 0.60 = 23.3 s. 29.2 s forgets to take off L; 16.7 s is the side road."
},
{
"q": "Course try: L = 12 s, y(A) = 0.40, y(B) = 0.30. What is C₀?",
"o": [
"76.7 s",
"57.5 s",
"32.9 s",
"23.0 s"
],
"a": 0,
"e": "Y = 0.70; C₀ = (1.5 × 12 + 5) ÷ (1 − 0.70) = 23 ÷ 0.30 = 76.7 s. 23 s forgets to divide; 32.9 s divides by 0.70 instead of 0.30."
},
{
"q": "Course trap: L = 10 s and Y = 0.90. What does Webster give for C₀?",
"o": [
"22 s",
"180 s",
"50 s",
"200 s"
],
"a": 3,
"e": "C₀ = 20 ÷ (1 − 0.90) = 20 ÷ 0.10 = 200 s. The formula blows up as Y approaches 1."
},
{
"q": "Lab F3: fixed time 18.96 s, actuated 14.48 s. About how much less delay did actuation give than fixed time?",
"o": [
"About 12%",
"About 24%",
"About 31%",
"About 4.5%"
],
"a": 1,
"e": "(18.96 − 14.48) ÷ 18.96 = 4.48 ÷ 18.96 ≈ 0.24. 31% divides by 14.48 instead; 4.5 is the difference in seconds."
},
{
"q": "Corridor run bus delay: actuated 38.0 s, SCOOT 22.9 s. By how much did SCOOT cut bus delay?",
"o": [
"22.9 s (about 60%)",
"15.1 s (about 40%)",
"1.3 s (about 4%)",
"15.1 s (about 66%)"
],
"a": 1,
"e": "38.0 − 22.9 = 15.1 s; 15.1 ÷ 38.0 ≈ 0.40. 66% divides by 22.9; 1.3 s is the mean-delay gap."
},
{
"q": "New numbers: L = 8 s and Y = 0.50. What is C₀?",
"o": [
"8.5 s",
"17 s",
"24 s",
"34 s"
],
"a": 3,
"e": "C₀ = (1.5 × 8 + 5) ÷ (1 − 0.50) = 17 ÷ 0.50 = 34 s. 17 s forgets to divide."
},
{
"q": "A side road carries 630 veh/h; its saturation flow is 1800 veh/h. What is its flow ratio y?",
"o": [
"35",
"0.65",
"2.86",
"0.35"
],
"a": 3,
"e": "y = q ÷ s = 630 ÷ 1800 = 0.35. 2.86 inverts the ratio; 0.65 is 1 − y."
},
{
"q": "L = 10 s, y(A) = 0.30, y(B) = 0.20. Webster gives C₀ = 40 s. What effective green does the side road B get?",
"o": [
"12 s",
"16 s",
"8 s",
"18 s"
],
"a": 0,
"e": "Green to share = 40 − 10 = 30 s; 30 × 0.20 ÷ 0.50 = 12 s. 16 s forgets to take off L; 18 s is road A."
},
{
"q": "That fixed plan gives road A 18 s of effective green in a 40 s cycle. With s = 1800 veh/h, what is A’s capacity?",
"o": [
"1800 veh/h",
"4000 veh/h",
"720 veh/h",
"810 veh/h"
],
"a": 3,
"e": "Capacity = s × g ÷ C = 1800 × 18 ÷ 40 = 810 veh/h. 4000 inverts g and C."
}
]
},
{
"n": 4,
"title": "What happens if…?",
"qs": [
{
"q": "Webster: what happens to C₀ as Y gets close to 1?",
"o": [
"It shrinks to zero",
"It becomes negative",
"It stays at 50 s",
"It grows very fast, towards hundreds of seconds"
],
"a": 3,
"e": "The bottom (1 − Y) shrinks towards zero, so C₀ blows up: Y = 0.9, L = 10 gives 200 s."
},
{
"q": "What happens if Y is 1 or more at a junction?",
"o": [
"The junction is over capacity: no cycle length can fix it",
"DoS falls below 0.9",
"Webster gives a perfect 60 s cycle",
"Actuation solves it by ending greens on gaps"
],
"a": 0,
"e": "Y ≥ 1 means demand needs more green than exists; real controllers cap the cycle."
},
{
"q": "Lost time L grows (longer intergreens), Y unchanged. What happens to Webster’s C₀?",
"o": [
"It becomes exactly L",
"It stays the same",
"It gets longer",
"It gets shorter"
],
"a": 2,
"e": "L is on the top of (1.5 L + 5) ÷ (1 − Y), so more lost time means a longer optimum cycle."
},
{
"q": "A fixed plan was designed from last year’s counts, and the rush hour now brings more traffic. What happens?",
"o": [
"The cycle shortens automatically",
"The stored green cannot clear it, so a queue piles up",
"The plan updates itself from the loops",
"Delay falls"
],
"a": 1,
"e": "A fixed plan stays good only while the flows stay the same; SCOOT adapts instead."
},
{
"q": "In an actuated signal, the gap between cars at the stop-line loop gets long. What happens?",
"o": [
"The offset is changed",
"The green is extended to the maximum",
"The cycle is lengthened for the whole region",
"The green ends"
],
"a": 3,
"e": "Actuation ends a green on a gap: nobody else is arriving, so the time goes to the other stage."
},
{
"q": "A platoon is 15 s away up the road. What can an actuated signal do about it?",
"o": [
"Hold the green ready for it, using its model",
"Shift its offset to meet it",
"Lengthen the regional cycle",
"Nothing yet: its stop-line loops cannot see what is coming"
],
"a": 3,
"e": "Actuation reacts only to what reaches its stop-line loops; SCOOT’s upstream loops give 10–20 s of warning."
},
{
"q": "In Lab F3, the traffic was light. What did SCOOT’s cycle optimiser do?",
"o": [
"Switched the junction to fixed time",
"Swapped to a stored plan",
"Lengthened it to the maximum",
"Shortened the cycle"
],
"a": 3,
"e": "In light traffic SCOOT shortened the cycle; while DoS rose in the peak it held it."
},
{
"q": "y(A) rises while y(B) stays the same. In Webster’s split gᵢ = (C₀ − L) × yᵢ ÷ Y, what happens to A’s share?",
"o": [
"A gets a smaller share",
"The shares stay equal",
"A gets a bigger share of the green",
"B gets all the green"
],
"a": 2,
"e": "Green is shared in proportion to flow ratio, so a larger y(A) ÷ Y means a larger share for A."
},
{
"q": "Junctions move from isolated to closely spaced along a busy corridor. What happens to SCOOT’s advantage?",
"o": [
"It stays exactly the same",
"Fixed time always wins there",
"It disappears",
"It tends to grow, because coordination matters more"
],
"a": 3,
"e": "Rule of thumb: the more traffic changes and the closer the junctions, the more an adaptive system can help."
},
{
"q": "SCOOT’s upstream loops start giving wrong counts. What happens?",
"o": [
"Delay falls because fewer cars are seen",
"The model’s predictions go wrong, and so do the timings",
"Nothing: SCOOT ignores the loops",
"SCOOT turns into actuated control by itself"
],
"a": 1,
"e": "SCOOT needs working detectors and a validated model; bad inputs mean bad predicted queues and timings."
}
]
},
{
"n": 5,
"title": "Everyday pictures",
"qs": [
{
"q": "In the course analogy, a printed bus timetable stands for…",
"o": [
"Actuation",
"A pedestrian button",
"SCOOT",
"Fixed time"
],
"a": 3,
"e": "A timetable runs the same plan whatever happens: that is a fixed-time signal."
},
{
"q": "“A driver who leaves as soon as nobody else is running for the bus” stands for…",
"o": [
"Fixed time",
"Webster’s formula",
"Actuation",
"SCOOT"
],
"a": 2,
"e": "Actuation ends the green on a gap: no one else is arriving, so off it goes."
},
{
"q": "The dispatcher with a radio who hears a crowd is coming in 15 seconds stands for…",
"o": [
"SCOOT, warned by its upstream loops",
"Actuation, watching the stop line",
"The engineer with a stopwatch",
"Fixed time, reading its timetable"
],
"a": 0,
"e": "Upstream detectors give SCOOT 10–20 s of warning, so it can plan for the platoon."
},
{
"q": "Where does the dispatcher analogy break down?",
"o": [
"The dispatcher is always slower than the timetable",
"The timetable never works",
"The dispatcher cannot hear the radio",
"At a single junction the dispatcher’s advantage is small; it grows with many junctions"
],
"a": 3,
"e": "The course says the gap is small at one junction; coordination is where SCOOT’s model pays off."
},
{
"q": "Memory palace: a timetable robot finishes at 19, a jumpy rabbit at 14 and a half, a calm dispatcher at just under 13. What are those times?",
"o": [
"Corridor bus delays",
"Cycle times in seconds",
"Webster greens",
"Lab F3 mean delays: 18.96, 14.48, 12.79 s"
],
"a": 3,
"e": "Robot = fixed time, rabbit = actuated, dispatcher = SCOOT; the times are mean delay per vehicle."
},
{
"q": "In the memory palace, the scales on the podium labelled “1.5 L + 5” remind you of…",
"o": [
"The LPU rule",
"The performance index",
"Robertson’s F",
"Webster’s optimum cycle formula"
],
"a": 3,
"e": "C₀ = (1.5 L + 5) ÷ (1 − Y)."
},
{
"q": "The Lab F3 bar chart shows mean delay for the three controllers. Which bar is tallest?",
"o": [
"Actuated",
"SCOOT",
"All are equal",
"Fixed time"
],
"a": 3,
"e": "Fixed time 18.96 s is the tallest bar; SCOOT 12.79 s is the shortest."
},
{
"q": "The chart caption says the gap between SCOOT and actuation is small. What lesson does it draw?",
"o": [
"At an isolated junction actuation is strong; coordination is where SCOOT pays off",
"SCOOT failed the test",
"Fixed time is best in light traffic",
"Actuation is useless"
],
"a": 0,
"e": "SCOOT beats fixed time by about a third but actuation by only about 12% at one junction."
},
{
"q": "The “elastic plan” animation: a fixed 24 s green against SCOOT’s green in the morning rush. Like which everyday device does SCOOT behave?",
"o": [
"A thermostat, nudging a little at a time",
"A printed timetable",
"An alarm clock that rings once",
"A light switch, on or off"
],
"a": 0,
"e": "SCOOT nudges the timings a few seconds at a time, following the traffic like a thermostat follows the temperature."
},
{
"q": "In the bathtub picture, a fixed plan meets a rush hour with more traffic than its green can clear. What do you see?",
"o": [
"The tub fills more each cycle: the queue piles up",
"The plug is never put in",
"The tub empties faster than before",
"The tap stops"
],
"a": 0,
"e": "Arrivals (the tap) exceed what the fixed green drains, so the queue grows; SCOOT would give more green."
}
]
},
{
"n": 6,
"title": "Exam challenge",
"qs": [
{
"q": "A fixed plan was built for Y = 0.60, L = 10 s (C₀ = 50 s). Traffic grows to Y = 0.75. What would Webster now recommend?",
"o": [
"200 s",
"62.5 s",
"50 s",
"80 s"
],
"a": 3,
"e": "C₀ = 20 ÷ (1 − 0.75) = 20 ÷ 0.25 = 80 s. The stored 50 s plan is now out of date."
},
{
"q": "Same junction: Y = 0.75 but the cycle stays 50 s with L = 10 s. Using DoS = Y × C ÷ (C − L), what is the DoS?",
"o": [
"0.60",
"About 1.25",
"0.75",
"About 0.94"
],
"a": 3,
"e": "0.75 × 50 ÷ 40 = 0.9375 ≈ 0.94, above the ≈ 90% target. (At Y = 0.60 it was 0.75.)"
},
{
"q": "Which statement about the evidence is true?",
"o": [
"Actuation beat SCOOT in Lab F3",
"SCOOT is usually better, not always: in the corridor run actuation had slightly less mean delay",
"Fixed time won the corridor run",
"SCOOT had the lowest delay in every test"
],
"a": 1,
"e": "Lab F3: SCOOT 12.79 s best. Corridor: actuated 29.1 s vs SCOOT 30.4 s, but SCOOT had fewer stops and less bus delay."
},
{
"q": "A council’s main goal is reliable buses on a busy corridor. Based on the corridor run, which controller suits it better and why?",
"o": [
"Actuated: 1.3 s less mean delay, so buses must be faster",
"Either: the results were identical",
"SCOOT: bus delay 22.9 s vs 38.0 s, with fewer stops",
"Fixed time: it never changes"
],
"a": 2,
"e": "The 1.3 s mean-delay gap is small; the 15.1 s bus-delay saving is large."
},
{
"q": "Why does SCOOT beat fixed time by much more (about 33%) than it beats actuation (about 12%) at one junction?",
"o": [
"SCOOT ran a longer cycle",
"Actuation already reacts to the traffic; fixed time cannot react at all",
"Fixed time had broken detectors",
"Actuation uses upstream loops too"
],
"a": 1,
"e": "Both actuation and SCOOT adapt; fixed time cannot, so most of the gain over fixed time comes from reacting at all."
},
{
"q": "TRANSYT and SCOOT share the same profile and dispersion model. Which dispersion idea do they share (link to group 3)?",
"o": [
"The LPU rule",
"Webster’s optimum cycle",
"Robertson’s model, F = 1 ÷ (1 + αβT)",
"Plan selection"
],
"a": 2,
"e": "Both use Robertson’s platoon dispersion; TRANSYT off-line, SCOOT on-line."
},
{
"q": "Webster’s plan is said to stay good “only while the flows stay the same”. Which SCOOT feature answers this weakness?",
"o": [
"Removing all detectors",
"A fixed 120 s cycle",
"Small, frequent changes to split, cycle and offset from live upstream data",
"A bigger library of stored plans"
],
"a": 2,
"e": "SCOOT edits the running plan a little at a time instead of relying on one stored plan."
},
{
"q": "An engineer is told to make an isolated, lightly used junction work well cheaply. What is a fair choice?",
"o": [
"A simple actuated (or fixed) controller may be good enough",
"Set Y above 1",
"Only SCOOT can run it",
"Use Webster with Y = 0.95"
],
"a": 0,
"e": "A simple controller can be enough at isolated, lightly used junctions; SCOOT needs working detectors and a validated model."
},
{
"q": "Webster with L = 14 s and Y = 0.60. What is C₀, and what is the green to share?",
"o": [
"57 s and 43 s",
"65 s and 65 s",
"65 s and 51 s",
"26 s and 12 s"
],
"a": 2,
"e": "C₀ = (1.5 × 14 + 5) ÷ 0.40 = 26 ÷ 0.40 = 65 s; green to share = 65 − 14 = 51 s."
},
{
"q": "Why does an actuated signal not coordinate a green wave like SCOOT?",
"o": [
"It decides locally from its own stop-line loops and does not share a cycle with neighbours",
"It has no loops at all",
"It copies SCOOT’s offsets",
"It always runs the longest cycle"
],
"a": 0,
"e": "Actuation reacts only locally; a green wave needs neighbours in one region sharing a cycle, with offsets set (F7)."
}
]
}
],
"qs": [
{
"q": "How does a fixed-time signal decide its green?",
"o": [
"It follows a stored plan",
"It waits for pedestrians",
"It uses stop-line detectors",
"It runs a model fed by upstream detectors"
],
"a": 0,
"e": "Fixed-time plans are often prepared off-line, for example with Webster’s formula or TRANSYT."
},
{
"q": "How does an actuated signal decide its green?",
"o": [
"It copies its neighbour",
"It extends the green while cars keep arriving at stop-line loops, and ends it on a gap",
"It never changes",
"It runs a model of the whole region"
],
"a": 1,
"e": "Actuation reacts to the traffic in front of it, but only locally."
},
{
"q": "Which description fits SCOOT?",
"o": [
"Upstream loops feed a model; small frequent changes; coordinated junctions",
"A stored plan only",
"One loop at the stop line, no model",
"Random timings"
],
"a": 0,
"e": "SCOOT predicts from upstream and adapts split, cycle and offset across a region."
},
{
"q": "In Lab F3 (one junction in SUMO), which controller had the lowest mean delay?",
"o": [
"Actuated",
"SCOOT",
"All the same",
"Fixed time"
],
"a": 1,
"e": "Fixed 18.96 s, actuated 14.48 s, SCOOT 12.79 s per vehicle."
},
{
"q": "SCOOT 12.79 s against fixed time 18.96 s. About how much less delay is that?",
"o": [
"33%",
"12%",
"25%",
"50%"
],
"a": 0,
"e": "(18.96 − 12.79) ÷ 18.96 = 6.17 ÷ 18.96 ≈ 0.33."
},
{
"q": "SCOOT 12.79 s against actuated 14.48 s. About how much less delay?",
"o": [
"33%",
"20%",
"5%",
"12%"
],
"a": 3,
"e": "(14.48 − 12.79) ÷ 14.48 = 1.69 ÷ 14.48 ≈ 0.12."
},
{
"q": "In the four-junction corridor run, which controller had slightly less mean delay?",
"o": [
"Actuated (29.1 s vs SCOOT 30.4 s)",
"All equal",
"Fixed time",
"SCOOT"
],
"a": 0,
"e": "SCOOT is usually better, not always: here actuation edged it on mean delay."
},
{
"q": "In that corridor run, what was SCOOT’s clearest advantage?",
"o": [
"It used the shortest cycle",
"It needed no detectors",
"It was cheapest",
"Fewer stops and much less bus delay"
],
"a": 3,
"e": "Stops 1.10 vs 1.15 per vehicle, and bus delay 22.9 s vs 38.0 s."
},
{
"q": "Where might a simple fixed or actuated controller be good enough?",
"o": [
"Where many buses need priority",
"On a corridor with closely spaced junctions",
"In a busy city-centre grid",
"At an isolated, lightly used junction"
],
"a": 3,
"e": "Adaptive control pays off most where traffic changes and junctions interact."
},
{
"q": "What does SCOOT need in order to work well?",
"o": [
"A fixed cycle",
"GPS in every car",
"No pedestrians",
"Working detectors and a validated model"
],
"a": 3,
"e": "With faulty loops or untuned settings the model’s predictions — and the timings — go wrong."
}
]
}
};
