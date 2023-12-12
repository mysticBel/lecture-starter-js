import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)
    if (fighter) {
        const { name, health, attack, defense } = fighter;

        const fighterName = createElement({ tagName: 'span', className: 'fighter-preview___name' });
        fighterName.innerText = `Name: ${name}`;

        const fighterHealth = createElement({ tagName: 'span', className: 'fighter-preview___health' });
        fighterHealth.innerText = `Health: ${health}`;

        const fighterAttack = createElement({ tagName: 'span', className: 'fighter-preview___attack' });
        fighterAttack.innerText = `Attack: ${attack}`;

        const fighterDefense = createElement({ tagName: 'span', className: 'fighter-preview___defense' });
        fighterDefense.innerText = `Defense: ${defense}`;

        fighterElement.append(fighterName, fighterHealth, fighterAttack, fighterDefense);
    }

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
