let resultArray = [];

const chance_char = 6;
const chance_pity_char = [
    66, 126, 186, 246, 306, 366, 426, 486, 546, 606, 666, 726, 786, 846, 906, 966, 1000
];

const chance_weap = 7;
const chance_pity_weap = [
    77, 147, 217, 287, 357, 427, 497, 567, 637, 707, 777, 847, 917, 987, 1000, 1000, 1000, 1000
];

const chance_new_system = [0, 50, 500, 1000];

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function calc(wishes, priority, goal_char = 1, goal_weap = 0, pity_char = 0, garanteed_char_p = false, pity_weap = 0, garanteed_weap = false, radiance_garanteed = false, lost_sequence = -1) {
    let banner_char = 0;
    let banner_weap = 0;
    let lost_banner_char = 0;
    // let pity_char = 0;
    // let pity_weap = 0;
    let guaranteed_char = garanteed_char_p;
    let guaranteed_banner_weapon = garanteed_weap;
    let guaranteed_weapon = radiance_garanteed;

    let spent_wishes = 0;

    for (let i = 0; i < 12; i++) {
        if (priority[i] === 0) {
            while (spent_wishes < wishes && banner_char < goal_char) {
                spent_wishes++;
                pity_char++;
                let chance = chance_char;

                if (pity_char >= 74) {
                    chance = chance_pity_char[pity_char - 74];
                }

                if (getRandomInt(1000) <= chance) {
                    // É o garantido
                    if (guaranteed_char) {
                        guaranteed_char = false;
                        pity_char = 0;
                        banner_char++;
                        break;

                    }

                    let new_system = lost_sequence === -1 ? 0 : chance_new_system[lost_banner_char];
                    // Nao é o garantido, mas Ganhou o 50/50
                    if (getRandomInt(1000) <= 500 || getRandomInt(1000) <= new_system) {
                        guaranteed_char = false;
                        pity_char = 0;
                        banner_char++;
                        lost_banner_char = 0;
                        break;
                    }

                    // Perdeu o 50/50, e o systema novo
                    guaranteed_char = true;
                    pity_char = 0;
                    lost_banner_char += 1;
                }
            }
        }

        if (priority[i] === 1) {
            while (spent_wishes < wishes && banner_weap < goal_weap) {
                spent_wishes++;
                pity_weap++;
                let chance = chance_weap;

                if (pity_weap >= 63) {
                    chance = chance_pity_weap[pity_weap - 63];
                }

                if (getRandomInt(1000) <= chance) {
                    if (guaranteed_weapon) {
                        guaranteed_weapon = false;
                        guaranteed_banner_weapon = false;
                        pity_weap = 0;
                        banner_weap++;
                        break;
                    } else if (!guaranteed_banner_weapon && getRandomInt(1000) <= 250) {
                        guaranteed_banner_weapon = true;
                        guaranteed_weapon = true;
                        pity_weap = 0;
                    } else {
                        guaranteed_banner_weapon = false;
                        pity_weap = 0;
                        if (getRandomInt(1000) <= 500) {
                            guaranteed_weapon = false;
                            banner_weap++;
                            break;
                        } else {
                            guaranteed_weapon = true;
                        }
                    }
                }
            }
        }
    }

    return { banner_char, banner_weap, spent_wishes };
}

function cumulativeFromEnd(arr) {
    let cumulativeArr = [...arr];
    for (let i = arr.length - 2; i >= 0; i--) {
        cumulativeArr[i] += cumulativeArr[i + 1];
    }
    return cumulativeArr;
}

function simulate(wishes, prio, pity_char, garanteed_char, pity_weap, garanteed_weap, garanteed_fate_weap, simulations = 100000) {
    let success = 0;
    let left = 0;
    let sim_weight = 100.0 / simulations;

    let goal_weap = 0;
    let goal_char = 0;
    for (let i = 0; i < prio.length; i++) {
        if (prio[i] == 0) {
            goal_char++;
        }
        if (prio[i] == 1) {
            goal_weap++;
        }
    }

    let arr = new Array(13).fill(0);
    let weap_avg = 0;

    for (let i = 0; i < simulations; i++) {
        let { banner_char, banner_weap, spent_wishes } = calc(wishes, prio, goal_char, goal_weap, pity_char, garanteed_char, pity_weap, garanteed_weap, garanteed_fate_weap);

        if (banner_char === goal_char && banner_weap === goal_weap) {
            success++;
        }

        left += (wishes - spent_wishes);
        arr[(banner_weap + banner_char)] += sim_weight;
        weap_avg += banner_weap;
    }

    let result_data = cumulativeFromEnd(arr).map(value => value.toFixed(1));
    success = (success * 100.0) / simulations;
    let leftover_wishes_avg = left / simulations;

    return { result_data, success, leftover_wishes_avg };
}

function getLabels(priority) {
    let labels = new Array(13).fill('');
    let char_label = '-';
    let char_num = 0;
    let weap_label = '';
    let weap_num = 0;
    for (let i = 0; i < 13; i++) {
        if (priority[i] === 0) {
            char_num += 1;
            char_label = "C" + (char_num - 1).toString();
        }
        if (priority[i] === 1) {
            weap_num += 1;
            weap_label = "R" + (weap_num).toString();
        }
        labels[i] = char_label + weap_label;
    }
    return labels;
}