const members = [
    { id: 'great_grandfather', name: 'Great Grandfather', img: 'assets/images/great_grandfather.png' },
    { id: 'great_grandmother', name: 'Great Grandmother', img: 'assets/images/great_grandmother.png' },
    { id: 'grandfather', name: 'Grandfather', img: 'assets/images/grandfather.png' },
    { id: 'grandmother', name: 'Grandmother', img: 'assets/images/grandmother.png' },
    { id: 'father', name: 'Father', img: 'assets/images/father.png' },
    { id: 'mother', name: 'Mother', img: 'assets/images/mother.png' },
    { id: 'uncle', name: 'Uncle', img: 'assets/images/uncle.png' },
    { id: 'aunt', name: 'Aunt', img: 'assets/images/aunt.png' },
    { id: 'older_brother', name: 'Older Brother', img: 'assets/images/older_brother.png' },
    { id: 'older_sister', name: 'Older Sister', img: 'assets/images/older_sister.png' },
    { id: 'younger_brother', name: 'Younger Brother', img: 'assets/images/younger_brother.png' },
    { id: 'younger_sister', name: 'Younger Sister', img: 'assets/images/younger_sister.png' },
    { id: 'cousin_male', name: 'Cousin (Male)', img: 'assets/images/cousin_male.png' },
    { id: 'cousin_female', name: 'Cousin (Female)', img: 'assets/images/cousin_female.png' },
    { id: 'baby', name: 'Baby', img: 'assets/images/baby.png' }
];

document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initDragAndDrop();
    initValidation();
});

function initGallery() {
    const photoList = document.getElementById('photo-list');
    const nameList = document.getElementById('name-list');

    // Shuffle photos and names separately
    const photoMembers = [...members].sort(() => Math.random() - 0.5);
    const nameMembers = [...members].sort(() => Math.random() - 0.5);

    photoMembers.forEach(m => {
        const card = createCard(m, 'photo');
        photoList.appendChild(card);
    });

    nameMembers.forEach(m => {
        const card = createCard(m, 'name');
        nameList.appendChild(card);
    });
}

function createCard(member, type) {
    const div = document.createElement('div');
    div.className = `person-card ${type}`;
    div.draggable = true;
    div.dataset.id = member.id;
    div.dataset.type = type;

    if (type === 'photo') {
        div.innerHTML = `<img src="${member.img}" alt="Portrait">`;
    } else {
        div.innerHTML = member.name;
    }

    div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('id', member.id);
        e.dataTransfer.setData('type', type);
        div.classList.add('dragging');
    });

    div.addEventListener('dragend', () => div.classList.remove('dragging'));

    return div;
}

function initDragAndDrop() {
    const zones = document.querySelectorAll('.drop-zone');

    zones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            const id = e.dataTransfer.getData('id');
            const type = e.dataTransfer.getData('type');

            // Check if type matches zone type
            if (zone.dataset.type !== type) return;

            const draggedCard = document.querySelector(`.person-card.dragging`);
            if (!draggedCard) return;

            // Handle replacement
            const existing = zone.querySelector('.person-card');
            if (existing) {
                const galleryId = type === 'photo' ? 'photo-list' : 'name-list';
                document.getElementById(galleryId).appendChild(existing);
            }

            zone.appendChild(draggedCard);
            zone.classList.add('occupied');
        });
    });

    // Support dropping back to gallery
    ['photo-list', 'name-list'].forEach(listId => {
        const list = document.getElementById(listId);
        list.addEventListener('dragover', (e) => e.preventDefault());
        list.addEventListener('drop', (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('id');
            const type = e.dataTransfer.getData('type');

            if ((listId === 'photo-list' && type === 'photo') ||
                (listId === 'name-list' && type === 'name')) {
                const card = document.querySelector(`.person-card.dragging`);
                if (card) {
                    list.appendChild(card);
                    document.querySelectorAll('.drop-zone').forEach(z => {
                        if (!z.querySelector('.person-card')) z.classList.remove('occupied');
                    });
                }
            }
        });
    });
}

function initValidation() {
    const btn = document.getElementById('btn-finish');
    const messageArea = document.getElementById('message-area');

    btn.addEventListener('click', () => {
        const zones = document.querySelectorAll('.drop-zone');
        let allCorrect = true;
        let anyEmpty = false;

        zones.forEach(zone => {
            zone.classList.remove('error');
            const card = zone.querySelector('.person-card');
            if (!card) {
                anyEmpty = true;
                allCorrect = false;
                zone.classList.add('error');
            } else if (card.dataset.id !== zone.dataset.role) {
                allCorrect = false;
                zone.classList.add('error');
            }
        });

        if (allCorrect) {
            showSuccess();
        } else {
            messageArea.textContent = anyEmpty ? "❌ Some zones are still empty!" : "❌ Placements are incorrect. Try again!";
            messageArea.className = 'error';
            setTimeout(() => { messageArea.textContent = ""; }, 4000);
        }
    });
}

function showSuccess() {
    const treeCanvas = document.getElementById('tree-canvas');
    treeCanvas.classList.add('magic-bg');

    // Start the sequential "growing" process
    drawGrowingLines();

    setTimeout(() => {
        document.getElementById('success-overlay').classList.remove('hidden');
    }, 4500);
}

async function drawGrowingLines() {
    const container = document.getElementById('tree-container');
    const rect = container.getBoundingClientRect();
    const getCenter = el => {
        const r = el.getBoundingClientRect();
        return { x: r.left - rect.left + r.width / 2, y: r.top - rect.top + r.height / 2 };
    };

    // Helper for delay
    const wait = ms => new Promise(res => setTimeout(res, ms));

    const ggf = document.querySelector('.level-0 .tree-node:nth-child(1)');
    const ggm = document.querySelector('.level-0 .tree-node:nth-child(2)');
    const gf = document.querySelector('.level-1 .tree-node:nth-child(1)');
    const gm = document.querySelector('.level-1 .tree-node:nth-child(2)');

    const father = document.querySelector('.level-2 .group:nth-child(1) .tree-node:nth-child(1)');
    const mother = document.querySelector('.level-2 .group:nth-child(1) .tree-node:nth-child(2)');
    const uncle = document.querySelector('.level-2 .group:nth-child(2) .tree-node:nth-child(1)');
    const aunt = document.querySelector('.level-2 .group:nth-child(2) .tree-node:nth-child(2)');

    const children = document.querySelectorAll('.level-3 .group.children .tree-node');
    const cousins = document.querySelectorAll('.level-3 .group.cousins .tree-node');

    // 1. Level 0 -> Level 1
    addLine(getCenter(ggf), getCenter(gf));
    addLine(getCenter(ggm), getCenter(gf));
    await wait(800);

    // 2. Level 1 -> Level 2
    addLine(getCenter(gf), getCenter(father));
    addLine(getCenter(gm), getCenter(father));
    addLine(getCenter(gf), getCenter(uncle));
    addLine(getCenter(gm), getCenter(uncle));
    await wait(800);

    // 3. Level 2 -> Level 3
    children.forEach(child => addLine(getCenter(mother), getCenter(child)));
    cousins.forEach(cousin => addLine(getCenter(aunt), getCenter(cousin)));
}

function addLine(p1, p2) {
    const svg = document.getElementById('tree-lines');
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Create a smooth curve or straight line
    const midY = (p1.y + p2.y) / 2;
    const d = `M ${p1.x} ${p1.y} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;

    line.setAttribute("d", d);
    line.setAttribute("class", "tree-line active");
    svg.appendChild(line);
}
