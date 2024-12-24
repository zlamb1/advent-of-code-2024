import * as fs from 'fs';

function createNodes(links) {
  const nodes = {};
  for (const link of links) {
    if (!nodes[link.first]) {
      nodes[link.first] = {name: link.first, links: [], sets: []};
    }
    nodes[link.first].links.push(link.second);
    if (!nodes[link.second]) {
      nodes[link.second] = {name: link.second, links: [], sets: []};
    }
    nodes[link.second].links.push(link.first);
  }

  return nodes;
}

function hasSetVariation(nodes, n1, n2, n3) {
  const names = [n1, n2, n3];

  for (let i = 0; i < 3; i++) {
    const n1 = names[i], n2 = names[(i + 1) % 3], n3 = names[(i + 2) % 3], sets = nodes[names[i]].sets;
    if (sets.includes(n1 + '-' + n2 + '-' + n3) ||
      sets.includes(n1 + '-' + n3 + '-' + n2) ||
      sets.includes(n2 + '-' + n1 + '-' + n3) ||
      sets.includes(n2 + '-' + n3 + '-' + n3) ||
      sets.includes(n3 + '-' + n1 + '-' + n2) ||
      sets.includes(n3 + '-' + n2 + '-' + n1)) {
      return true;
    }
  }

  return false;
}

function partOne() {
  fs.readFile('day23.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const links = data.split('\n').map(pair => ({
      first: pair.split('-')[0],
      second: pair.split('-')[1],
    }));

    const nodes = createNodes(links);

    const sets = [];
    for (const nodeName of Object.keys(nodes)) {
      if (nodeName.startsWith('t')) {
        const node = nodes[nodeName];
        for (const linkedName of node.links) {
          const linkedNode = nodes[linkedName];
          for (const secondLinkedName of linkedNode.links) {
            if (node.links.includes(secondLinkedName) && !hasSetVariation(nodes, nodeName, linkedName, secondLinkedName)) {
              const setName = nodeName + '-' + linkedName + '-' + secondLinkedName;
              sets.push(setName);
              node.sets.push(setName);
            }
          }
        }
      }
    }

    console.log(sets.length);
  });
}

function partTwo() {
  fs.readFile('day23.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const links = data.split('\n').map(pair => ({
      first: pair.split('-')[0],
      second: pair.split('-')[1],
    }));

    const nodes = createNodes(links);
    const allNodeNames = Object.keys(nodes);

    // https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
    function BronKerbosch1(r = [], p = allNodeNames, x = []) {
      if (!p.length && !x.length) {
        return [r];
      }

      let sets = [];
      for (const node of [...p]) {
        const _p = [], _x = [];
        for (const _node of nodes[node].links) {
          if (p.includes(_node)) _p.push(_node);
          if (x.includes(_node)) _x.push(_node);
        }

        const _sets = BronKerbosch1([...r, node], _p, _x);
        sets = [...sets, ..._sets];

        p.splice(p.indexOf(node), 1);
        x.push(node);
      }

      return sets;
    }


    function logPassword(set) {
      console.log(set.sort((a, b) => a.localeCompare(b)).join(','));
    }

    // cy,fd,gq,jc,ko,li,nz,ob,ov,qt,ss,vi,wt
    const sets = BronKerbosch1().sort((a, b) => b.length - a.length);
    logPassword(sets[0]);
  });
}

partTwo();