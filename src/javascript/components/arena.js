import createElement from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';
import controls from '../../constants/controls';
import { fight, getBlockPower, getDamage, getHitPower } from './fight';

function createFighter(fighter, position) {
    const imgElement = createFighterImage(fighter);
    const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
    const fighterElement = createElement({
        tagName: 'div',
        className: `arena___fighter ${positionClassName}`
    });

    fighterElement.append(imgElement);
    return fighterElement;
}

function createFighters(firstFighter, secondFighter) {
    const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
    const firstFighterElement = createFighter(firstFighter, 'left');
    const secondFighterElement = createFighter(secondFighter, 'right');

    battleField.append(firstFighterElement, secondFighterElement);
    return battleField;
}

function createHealthIndicator(fighter, position) {
    const { name } = fighter;
    const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
    const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
    const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
    const bar = createElement({
        tagName: 'div',
        className: 'arena___health-bar',
        attributes: { id: `${position}-fighter-indicator` }
    });

    fighterName.innerText = name;
    indicator.append(bar);
    container.append(fighterName, indicator);

    return container;
}

function createHealthIndicators(leftFighter, rightFighter) {
    const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
    const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
    const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
    const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

    healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
    return healthIndicators;
}

function createArena(selectedFighters) {
    const arena = createElement({ tagName: 'div', className: 'arena___root' });
    const healthIndicators = createHealthIndicators(...selectedFighters);
    const fighters = createFighters(...selectedFighters);

    arena.append(healthIndicators, fighters);
    return arena;
}

function updateFightStatus(selectedFighters) {
    const [firstFighter, secondFighter] = selectedFighters;

    const leftFighterHealth = Math.max(0, firstFighter.health);
    const leftHealthIndicator = document.getElementById('left-fighter-indicator');
    leftHealthIndicator.style.width = `${leftFighterHealth}%`;

    const rightFighterHealth = Math.max(0, secondFighter.health);
    const rightHealthIndicator = document.getElementById('right-fighter-indicator');
    rightHealthIndicator.style.width = `${rightFighterHealth}%`;
}

function endFight(winner) {
    const winnerContainer = document.getElementById('winner-container');
    const winnerName = document.getElementById('winner-name');

    if (winner) {
        winnerName.innerText = `Winner: ${winner.name}`;
        winnerContainer.classList.add('fullscreen');
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    } else {
        winnerName.innerText = 'Both are winners!';
    }
}

export default async function renderArena(selectedFighters) {
    const root = document.getElementById('root');
    const arena = createArena(selectedFighters);

    root.innerHTML = '';
    root.append(arena);

    // todo:
    // - start the fight
    // - when fight is finished show winner

    let winner = null;
    winner = await fight(...selectedFighters);

    const winnerElement = createElement({ tagName: 'div', className: 'arena___winner' });
    arena.append(winnerElement);

    function handleKeyDown(event) {
        const [firstFighter, secondFighter] = selectedFighters;
        if (event.code === controls.PlayerOneAttack) {
            const firstFighterHitPower = getHitPower(firstFighter);
            const secondFighterBlockPower = getBlockPower(secondFighter);
            const firstFighterDamage = getDamage(firstFighterHitPower, secondFighterBlockPower);
            secondFighter.health -= firstFighterDamage;

            updateFightStatus(selectedFighters);
        } else if (event.code === controls.PlayerOneBlock) {
            firstFighter.defense += 10;
        } else if (event.code === controls.PlayerTwoAttack) {
            const secondFighterHitPower = getHitPower(secondFighter);
            const firstFighterBlockPower = getBlockPower(firstFighter);
            const secondFighterDamage = getDamage(secondFighterHitPower, firstFighterBlockPower);
            firstFighter.health -= secondFighterDamage;

            updateFightStatus(selectedFighters);
        } else if (event.code === controls.PlayerTwoBlock) {
            secondFighter.defense += 10;
        } else if (controls.PlayerOneCriticalHitCombination.includes(event.code)) {
            const firstFighterHitPower = getHitPower(firstFighter) * 2;
            const secondFighterBlockPower = getBlockPower(secondFighter);
            const firstFighterDamage = getDamage(firstFighterHitPower, secondFighterBlockPower);
            secondFighter.health -= firstFighterDamage;

            updateFightStatus(selectedFighters);
        } else if (controls.PlayerTwoCriticalHitCombination.includes(event.code)) {
            const secondFighterHitPower = getHitPower(secondFighter) * 2;
            const firstFighterBlockPower = getBlockPower(firstFighter);
            const secondFighterDamage = getDamage(secondFighterHitPower, firstFighterBlockPower);
            firstFighter.health -= secondFighterDamage;

            updateFightStatus(selectedFighters);
        }

        if (firstFighter.health <= 0 && secondFighter.health <= 0) {
            winner = null;
        } else if (firstFighter.health <= 0) {
            winner = secondFighter;
        } else if (secondFighter.health <= 0) {
            winner = firstFighter;
        }
        const winnerContainer = document.getElementById('winner-container');

        if (winner) {
            winnerContainer.style.display = 'block';
            endFight(winner);
            document.removeEventListener('keydown', handleKeyDown);
        } else {
            winnerContainer.style.display = 'none';
        }
    }

    document.addEventListener('keydown', handleKeyDown);
}
