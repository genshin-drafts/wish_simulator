#include <iostream>
#include <random>

// Soft pity starts at 74;
static int chance_char = 6;
static int chance_pity_char[17] = {
    66,
    126,
    186,
    246,
    306,
    366,
    426,
    486,
    546,
    606,
    666,
    726,
    786,
    846,
    906,
    966,
    1000
};

// Soft pity starts at 63
static int chance_weap = 7;
static int chance_pity_weap[18] = {
    77,
    147,
    217,
    287,
    357,
    427,
    497,
    567,
    637,
    707,
    777,
    847,
    917,
    987,
    1000,
    1000,
    1000,
    1000
};


void calc(int wishes, int& chars, int& wishesForChars, int& weaps, int& wishesForWeaps)
{
    int banner_char = 0;
    int banner_weap = 0;
    std::random_device dev;
    std::mt19937 rng(dev());
    std::uniform_int_distribution<std::mt19937::result_type> dist(1,1000); // distribution in range [1, 6]
 
    int pity = 0;
    bool garanteed = false;
    int spent_wishes = 0;
    for (; spent_wishes < wishes && banner_char < 7; spent_wishes++)
    {
        pity++;
        int chance = chance_char;
        if (pity >= 74) {
            chance = chance_pity_char[pity - 74];
        }

        // Got 5*
        if (dist(rng) <= chance)
        {
            // Lost banner character
            if (!garanteed && dist(rng) <= 500) {
                garanteed = true;
                pity = 0;
            }
            // Won banner character
            else { 
                garanteed = false;
                pity = 0;
                banner_char++;
            }
        }        
    }

    chars = banner_char;
    wishesForChars = spent_wishes;

    bool garanteed_banner = false;
    bool garanteed_weapon = false;
    pity = 0;
    for (; spent_wishes < wishes && banner_weap < 5; spent_wishes++)
    {
        pity++;
        int chance = chance_weap;
        if (pity >= 63) {
            chance = chance_pity_char[pity - 63];
        }

        // Got 5*
        if (dist(rng) <= chance)
        {
            if (garanteed_weapon) {                               // Arma selecionada garantida
                garanteed_weapon = false;
                garanteed_banner = false;
                pity = 0;
                banner_weap++;
            } else if (!garanteed_banner && dist(rng) <= 250) {  // Perdeu o 25/75
                garanteed_banner = true;
                garanteed_weapon = true;
                pity = 0;
            }  else {                                             // Ganhou o 25/75
                garanteed_banner = false;
                pity = 0;
                if (dist(rng) <= 500)  // Ganhou a selecionada
                {
                    banner_weap++;
                    garanteed_weapon = false;
                } else {               // Nao ganhou a selecionada
                    garanteed_weapon = true;
                }

                
            }
        }        
    }

    
    weaps = banner_weap;
    wishesForWeaps = spent_wishes;
}

int main() {
    const int wishes = 1200;
    int chars, wishesChars, weaps, wishesWeaps;
    int success = 0;
    int left = 0;
    const int simulations = 10000;
    for (int i = 0; i < simulations; i++) {
        calc(wishes, chars, wishesChars, weaps, wishesWeaps);
        if (chars == 7 && weaps == 5) {
            success++;
        }
        left += wishes - wishesWeaps;
    }
    
    std::cout << "Success: " << float(success * 100) / simulations << "%; Wishes left: " << float(left) / simulations << std::endl;
}