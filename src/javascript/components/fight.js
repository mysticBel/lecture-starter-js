// import controls from '../../constants/controls';

export function getDamage(attacker, defender) {
    // return damage
    const damage = Math.max(attacker - defender, 0);
    return damage;
}

export function getHitPower(fighter) {
    // return hit power
    const { attack } = fighter;
    // Generate random value between 1 and 2
    const randomValue = Math.random() * (2 - 1) + 1;
    const power = attack * randomValue;
    return power;
}

export function getBlockPower(fighter) {
    // return block power
    const { defense } = fighter;
    // Generate random value between 1 and 2
    const randomValue = Math.random() * (2 - 1) + 1;
    const power = defense * randomValue;
    return power;
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        const maxRounds = 1;
        let currentRound = 1;
        let winner = null;

        let firstFighterHealth = firstFighter.health;
        let secondFighterHealth = secondFighter.health;

        while (currentRound <= maxRounds) {
            const firstFighterHitPower = getHitPower(firstFighter);
            const secondFighterHitPower = getHitPower(secondFighter);

            const firstFighterBlockPower = getBlockPower(firstFighter);
            const secondFighterBlockPower = getBlockPower(secondFighter);

            const firstFighterDamage = getDamage(secondFighterHitPower, firstFighterBlockPower);
            const secondFighterDamage = getDamage(firstFighterHitPower, secondFighterBlockPower);

            firstFighterHealth -= firstFighterDamage;
            secondFighterHealth -= secondFighterDamage;

            // condition
            if (firstFighter.health <= 0 && secondFighter.health <= 0) {
                winner = null;
                break;
            } else if (firstFighterHealth <= 0) {
                winner = secondFighter;
                break;
            } else if (secondFighterHealth <= 0) {
                winner = firstFighter;
                break;
            }

            currentRound += 1;
        }

        resolve(winner);
    });
}
