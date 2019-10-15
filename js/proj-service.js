'use strict';
var gProjs = [
    createProj(0, 'Pacman', 'Game project', ['Games']),
    createProj(1, 'Mine Sweeper', 'Game project', ['Games']),
    createProj(2, 'Touch Nums', 'Game project', ['Games'])
]

function createProj(id, name, title, labels) {
    return {
        id,
        name,
        title,
        desc: 'Lorem descripsum',
        url: `./projects/${id}`,
        thumbnail: '/img/thumbnail.png',
        publishedAt: 1029371982739182,
        labels
    }
}

function runProj(proj) {

}

function getProjects() {
    return gProjs;
}