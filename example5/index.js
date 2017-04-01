const createCell = (x, y) => ({
  x,
  y,
  top: false,
  bottom: false,
  left: false,
  right: false,
  isVisited: false
});
class Maze {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.roomline = [];
    this.maze_cells = [];
    this.init();
  }

  init() {
    this.cell = Math.round(1000 / this.col);
    for (var i = 0; i < this.row; i++) {
      this.maze_cells[i] = [];
      for (var j = 0; j < this.col; j++) {
        this.maze_cells[i].push(createCell(j, i));
      }
    }

    const start_cell = { x: 0, y: 0 };
    this.roomline.push(start_cell);
    this.maze_cells[0][0].left = true;
    this.maze_cells[this.row - 1][this.col - 1].right = true;
    this.calcCells(0, 0);
  }

  calcCells(x, y) {
    var neighbors = [];
    if (x - 1 >= 0 && !this.maze_cells[x - 1][y].isVisited) {
      neighbors.push({ 'x': x - 1, 'y': y })
    }
    if (x + 1 < this.row && !this.maze_cells[x + 1][y].isVisited) {
      neighbors.push({ 'x': x + 1, 'y': y })
    }
    if (y - 1 >= 0 && !this.maze_cells[x][y - 1].isVisited) {
      neighbors.push({ 'x': x, 'y': y - 1 })
    }
    if (y + 1 < this.col && !this.maze_cells[x][y + 1].isVisited) {
      neighbors.push({ 'x': x, 'y': y + 1 })
    }

    if (neighbors.length) {
      const current = { x, y };
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      this.maze_cells[next.x][next.y].isVisited = true;
      this.roomline.push({ 'x': next.x, 'y': next.y });
      this.breakWall(current, next);
      this.calcCells(next.x, next.y);
    } else {
      // const next = this.roomline.pop();
      // if (next) this.calcCells(next.x, next.y);
      if (this.roomline.length) {
        const next = this.roomline.splice(Math.floor(Math.random * this.roomline.length), 1)[0];
        this.calcCells(next.x, next.y);
      }
    }
  }

  breakWall(cur, next) {
    if (cur.x < next.x) {
      this.maze_cells[cur.x][cur.y].bottom = true;
      this.maze_cells[next.x][next.y].top = true;
    }
    if (cur.x > next.x) {
      this.maze_cells[cur.x][cur.y].top = true;
      this.maze_cells[next.x][next.y].bottom = true;
    }
    if (cur.y < next.y) {
      this.maze_cells[cur.x][cur.y].right = true;
      this.maze_cells[next.x][next.y].left = true;
    }
    if (cur.y > next.y) {
      this.maze_cells[cur.x][cur.y].left = true;
      this.maze_cells[next.x][next.y].right = true;
    }
  }
}

const createCellElement = mazeArr => {
  const container = document.createElement('div');
  container.id = 'cells';

  mazeArr.forEach(rowArr => {
    const row = document.createElement('div');
    row.className = 'row';
    rowArr.forEach(cell => {
      const aspect = [];
      if (!cell.top) aspect.push('top');
      if (!cell.bottom) aspect.push('bottom');
      if (!cell.left) aspect.push('left');
      if (!cell.right) aspect.push('right');

      const cellElement = document.createElement('div');
      cellElement.className = `${aspect.join(' ')} cell`;
      row.appendChild(cellElement);
    });

    container.appendChild(row);
  })

  document.body.appendChild(container);
}

function rat(maze, start, end) {
  let over = false;
  function* seekRoad(x, y){
    yield ({ x, y, go: 1 });
    if (x === end.x && y === end.y) over = true;
    const current = maze[x][y];
    current.isVisited = 2;
    if (!over && current.top && x > 0 && maze[x - 1][y].isVisited !== 2) yield* seekRoad(x - 1, y);
    if (!over && current.bottom && x < maze.length - 1 && maze[x + 1][y].isVisited !== 2) yield* seekRoad(x + 1, y);
    if (!over && current.left && y > 0 && maze[x][y - 1].isVisited !== 2) yield* seekRoad(x, y - 1);
    if (!over && current.right && y < maze[0].length - 1 && maze[x][y + 1].isVisited !== 2) yield* seekRoad(x, y + 1);
    if (!over) yield ({ x, y, go: 0 });;
  }
  return seekRoad(start.x, start.y);
}

const row = prompt('input your row', '10');
const col = prompt('input your col', '10');
const maze = new Maze(+row, +col);
createCellElement(maze.maze_cells);
const oneStepRat = rat(maze.maze_cells, { x: 0, y: 0 }, { x: maze.maze_cells.length - 1, y: maze.maze_cells[0].length - 1 });

+function () {
  const step = ratStep.next();
  if (!step.done) {
    if (step.value.go) {
      document.querySelectorAll('.row')[step.value.x].querySelectorAll('.cell')[step.value.y].style.background = 'red';
    } else {
      document.querySelectorAll('.row')[step.value.x].querySelectorAll('.cell')[step.value.y].style.background = 'white';
    }
    setTimeout(arguments.callee, 50);
  }
}();
