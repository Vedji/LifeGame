const game_speed = 100;                             // Скорость игры
const width = 32;                                   // Ширина игрового поля
const height = 32;                                  // Высота игрового поля
const robotEnergy = 300;                            // Стартовая энергия робота
const genomeLength = 64;                            // Длинна генома
const genomeRuleMax = 32;                           // Максимальное значение в ячейки генома
const randomChildGenome = 4;                        // Сколько ген будет заменено у ребенка
const childAppendEnergyThreshold = 600;             // Порог при котором клетка будет пытаться заспавнить новую клетку
const childEnergy = 300;                            // Сколько энергии клетка отдаст своему клону
const moveEnergyCost = 10;                          // Сколько энергии нужно для перемещения клетки
const energyPerTurn = 1;                            // Сколько энергии добавляется каждый ход
const corpseEnergyBase = robotEnergy;               // Сколько изначально энергии у мертвого робота
const corpseEnergyRemovedPerTick = 1;               // Сколько энергии убывает кажщдый тик у мертвой клетки
const hunterEnergyMoveCost = 15;                    // Сколько энергии потребляет охотник за ход
const hunterStartedEnergy = 300;                    // Стартовое количество энергии охотника
const childHunterAppendEnergyThreshold = 1600;      // Порог при котором клетка будет пытаться заспавнить новую клетку
const childHunterEnergy = 300;                      // Сколько энергии клетка отдаст своему клону
var turnToDie = 250;                                //



class Robot {
    constructor(energy = null, genome = null) {
        this.genome = genome !== null ? genome : this.generateGenome();
        this.turn = 0;
        this.energy = energy === null ? robotEnergy : energy;
        this.isUpdateComplete = false;
        this.robotType = "robot"
        this.show_genome = document.getElementById("show-genome-robot");
    }

    generateGenome(){
        let new_genome = [];
        for (let i = 0; i < genomeLength; i++){
            new_genome.push(Math.floor(Math.random() * (genomeRuleMax + 1)));
        }
        return new_genome;
    }

    append_child_to_field(x, y, new_x, new_y, field, new_genome){
        if (x === new_x && y === new_y)
            return;
        this.energy = this.energy - childEnergy;
        field[new_y][new_x].setVeganRobot(new VeganRobot(childEnergy, new_genome));
    }

    appendChild(x, y, field){
        let new_genome = [...this.genome]
        for (let i = 0; i < randomChildGenome; i++){
            let random_gen = Math.floor(Math.random() * (genomeLength + 1));
            new_genome[random_gen] = Math.floor(Math.random() * (genomeRuleMax + 1));
        }

        let dx = 0;
        let dy = 0;
        switch (this.genome.at(this.turn) % 8) {

            case 0: // Сверху
                dx = x;
                dy = y;
                if (y - 1 >= 0 && !field[y - 1][x].isCellBusy())
                    dy = y - 1;
                this.append_child_to_field(x, y, dx, dy, field, new_genome);
                break;
            case 1:
                dx = x;
                dy = y;
                if (y + 1 < height && !field[y + 1][x].isCellBusy())
                    dy = y + 1;
                this.append_child_to_field(x, y, dx, dy, field, new_genome);
                break;
            case 2:
                dx = x;
                dy = y;
                if (x - 1 < 0 && !field[y][width - 1].isCellBusy())
                    dx = width - 1;
                if (x - 1 >= 0 && !field[y][x - 1].isCellBusy())
                    dx = x - 1;
                this.append_child_to_field(x, y, dx, dy, field, new_genome);
                break;
            case 3:
                dx = x;
                dy = y;
                if (x + 1 >= width && !field[y][0].isCellBusy())
                    dx = 0;
                if (x + 1 < width && !field[y][x + 1].isCellBusy())
                    dx = x + 1;
                this.append_child_to_field(x, y, dx, dy, field, new_genome);
                break;
            case 4:
                dx = x;
                dy = y;
                if (y - 1 >= 0 && !field[y - 1][x].isCellBusy())
                    dy = y - 1;
                if (x - 1 >= 0 && !field[dy][x - 1].isCellBusy())
                    dx = x - 1;
                if (x - 1 < 0 && !field[dy][width - 1].isCellBusy())
                    dx = width - 1;
                this.append_child_to_field(x, y, dx, dy, field, new_genome);
                break;
            case 5:
                dx = x;
                dy = y;
                if (y - 1 >= 0 && !field[y - 1][x].isCellBusy())
                    dy = y - 1;
                if (x + 1 < width && !field[dy][x + 1].isCellBusy())
                    dx = x + 1;
                if (x + 1 >= width && !field[dy][0].isCellBusy())
                    dx = 0;
                this.append_child_to_field(x, y, dx, dy, field, new_genome);
                break;
            case 6:
                dx = x;
                dy = height - 1;
                if (y + 1 < height && !field[y + 1][x].isCellBusy())
                    dy = y + 1;
                if (x - 1 >= 0 && !field[dy][x - 1].isCellBusy())
                    dx = x - 1;
                if (x - 1 < 0 && !field[dy][width - 1].isCellBusy())
                    dx = width - 1;
                this.append_child_to_field(x, y, dx, dy, field, new_genome);
                break;
            case 7:
                dx = x;
                dy = height - 1;
                if (y + 1 < height && !field[y + 1][x].isCellBusy())
                    dy = y + 1;
                if (x + 1 < width && !field[dy][x + 1].isCellBusy())
                    dx = x + 1;
                if (x + 1 >= width && !field[dy][0].isCellBusy())
                    dx = 0;
                this.append_child_to_field(x, y, dx, dy, field, new_genome);
                break;
        }

    }

    edit_position(x, y, new_x, new_y, field){
        if (x === new_x && y === new_y)
            return;
        if (field[new_y][new_x].isCellBusy() && field[new_y][new_x].value.robotType === "corpse"){
            this.energy += field[new_y][new_x].value.energy;
            field[new_y][new_x].setNullRobot();
        }
        if (field[new_y][new_x].isCellBusy())
            return;
        field[new_y][new_x].setVeganRobot(this);
        field[y][x].setNullRobot();
    }

    move(command, x, y, field){
        let dx = 0;
        let dy = 0;
        switch (command) {

            case "up":
                dx = x;
                dy = y;
                if (y - 1 >= 0)
                    dy = y - 1;
                this.edit_position(x, y, dx, dy, field);
                break;
            case "down":
                dx = x;
                dy = y;
                if (y + 1 < height)
                    dy = y + 1;
                this.edit_position(x, y, dx, dy, field);
                break;
            case "left":
                dx = x;
                dy = y;
                if (x - 1 < 0)
                    dx = width - 1;
                if (x - 1 >= 0)
                    dx = x - 1;
                this.edit_position(x, y, dx, dy, field);
                break;
            case "right":
                dx = x;
                dy = y;
                if (x + 1 >= width)
                    dx = 0;
                if (x + 1 < width)
                    dx = x + 1;
                this.edit_position(x, y, dx, dy, field);
                break;
            case "up-left":
                dx = x;
                dy = y;
                if (y - 1 >= 0)
                    dy = y - 1;
                if (x - 1 >= 0)
                    dx = x - 1;
                if (x - 1 < 0)
                    dx = width - 1;
                this.edit_position(x, y, dx, dy, field);
                break;
            case "up-right":
                dx = x;
                dy = y;
                if (y - 1 >= 0)
                    dy = y - 1;
                if (x + 1 < width)
                    dx = x + 1;
                if (x + 1 >= width)
                    dx = 0;
                this.edit_position(x, y, dx, dy, field);
                break;
            case "down-left":
                dx = x;
                dy = height - 1;
                if (y + 1 < height)
                    dy = y + 1;
                if (x - 1 >= 0)
                    dx = x - 1;
                if (x - 1 < 0)
                    dx = width - 1;
                this.edit_position(x, y, dx, dy, field);
                break;
            case "down-right":
                dx = x;
                dy = height - 1;
                if (y + 1 < height)
                    dy = y + 1;
                if (x + 1 < width)
                    dx = x + 1;
                if (x + 1 >= width)
                    dx = 0;
                this.edit_position(x, y, dx, dy, field);
                break;
        }
    }

    next_turn(turn){
        turn = this.genome[turn] % 9 + turn + 1;
        if (turn >= genomeLength)
            turn = turn % genomeLength;
        return turn;
    }

    robot_die(x, y, field){
        if (this.energy < 0)
            field[y][x].setCorpseRobot(new Corpse());
        this.show_genome.innerHTML = "";
        let p = document.createElement("p");
        p.textContent = this.genome;
        this.show_genome.appendChild(p)
    }

    updateRobot(x, y, field){
        field[y][x].updateCell();
        this.energy -= moveEnergyCost;
        this.robot_die(x, y, field);
        this.energy += (height - y) * energyPerTurn;
        let rule = this.genome[this.turn];
        if (this.energy > childAppendEnergyThreshold){
            this.appendChild(x, y, field);
        }
        switch (rule) {
            case 0:
                this.move("up-left", x, y, field);
                break;
            case 1:
                this.move("up", x, y, field);
                break;
            case 2:
                this.move("up-right", x, y, field);
                break;
            case 3:
                this.move("right", x, y, field);
                break;
            case 4:
                this.move("down-right", x, y, field);
                break;
            case 5:
                this.move("down", x, y, field);
                break;
            case 6:
                this.move("down-left", x, y, field);
                break;
            case 7:
                this.move("left", x, y, field);
                break;
        }
        this.turn = this.next_turn(this.turn);

    }
}

class VeganRobot extends Robot{
    constructor(energy = null, genome = null) {
        super(energy, genome);
        this.robotType = "vegan"
        this.show_genome = document.getElementById("show-genome-vegan");
    }
}

class Corpse extends Robot{
    constructor(energy = null, genome = null) {
        super(energy, genome);
        this.energy = corpseEnergyBase;
        this.robotType = "corpse";
        this.show_genome = document.getElementById("show-genome-hunter");

    }

    edit_position(x, y, new_x, new_y, field){
        if (x === new_x && y === new_y)
            return;
        if (field[new_y][new_x].isCellBusy() && field[new_y][new_x].value.robotType === "corpse"){
            if (this.energy > field[new_y][new_x].value.energy){
                this.energy += field[new_y][new_x].value.energy;
                field[new_y][new_x].setNullRobot();
            }
        }
        if (field[new_y][new_x].isCellBusy())
           return;
        field[new_y][new_x].setCorpseRobot(this);
        field[y][x].setNullRobot();
    }

    updateRobot(x, y, field){
        this.energy -= corpseEnergyRemovedPerTick;
        this.robot_die(x, y, field);
        this.move("down", x, y, field);
        field[y][x].updateCell();
    }
}

class Hunter extends Robot{
    constructor(energy = null, genome = null) {
        super(energy === null ? hunterStartedEnergy : energy, genome);
        this.robotType = "hunter";
    }

    edit_position(x, y, new_x, new_y, field){
        if (x === new_x && y === new_y)
            return;
        if (field[new_y][new_x].isCellBusy() && field[new_y][new_x].value.robotType === "corpse"){
            this.energy += field[new_y][new_x].value.energy;
            field[new_y][new_x].setNullRobot();
        }
        if (field[new_y][new_x].isCellBusy() && field[new_y][new_x].value.robotType === "vegan"){
            this.energy += field[new_y][new_x].value.energy;
            field[new_y][new_x].setNullRobot();
        }
        if (field[new_y][new_x].isCellBusy() && field[new_y][new_x].value.robotType === "hunter"){
            this.energy += field[new_y][new_x].value.energy;
            field[new_y][new_x].setNullRobot();
        }
        field[new_y][new_x].setHunterRobot(this);
        field[y][x].setNullRobot();
    }

    append_child_to_field(x, y, new_x, new_y, field, new_genome){
        if (x === new_x && y === new_y)
            return;
        this.energy = this.energy - childHunterEnergy;
        field[new_y][new_x].setHunterRobot(new Hunter(childHunterEnergy, new_genome));
    }

    updateRobot(x, y, field){
        field[y][x].updateCell();
        this.energy = this.energy - hunterEnergyMoveCost;
        if (this.energy < 0)
            field[y][x].setCorpseRobot(new Corpse());
        if (this.energy > childHunterAppendEnergyThreshold){
            this.appendChild(x, y, field);
        }
        let rule = this.genome[this.turn];
        switch (rule) {
            case 0:
                this.move("up-left", x, y, field);
                break;
            case 1:
                this.move("up", x, y, field);
                break;
            case 2:
                this.move("up-right", x, y, field);
                break;
            case 3:
                this.move("right", x, y, field);
                break;
            case 4:
                this.move("down-right", x, y, field);
                break;
            case 5:
                this.move("down", x, y, field);
                break;
            case 6:
                this.move("down-left", x, y, field);
                break;
            case 7:
                this.move("left", x, y, field);
                break;
        }
        this.turn = this.next_turn(this.turn);

    }
}

class Cell {
    constructor(cell_show_element, cell_value = null) {
        this.value = cell_value;
        this.cell_show_element = cell_show_element;

        this.cell_show_element.addEventListener("click", () => {
            this.value = new Hunter();
        })
    }

    isCellBusy(){
        return this.value !== null;
    }

    updateCell(){
        if (this.isCellBusy())
        {
            let p = this.cell_show_element.getElementsByTagName("p")[0];
            p.textContent = this.value.energy;
        }
    }

    setNullRobot(){
        this.cell_show_element.setAttribute("class", "game-board-cell");
        let p = this.cell_show_element.getElementsByTagName("p")[0];
        p.textContent = "";
        this.value = null;
    }

    setVeganRobot(value){
        this.value = value;
        this.cell_show_element.setAttribute("class", "game-board-cell game-board-cell-robot-vegan");
        let p = this.cell_show_element.getElementsByTagName("p")[0];
        p.textContent = this.value.energy;
    }

    setHunterRobot(value){
        this.value = value;
        this.cell_show_element.setAttribute("class", "game-board-cell game-board-cell-robot-hunter");
        let p = this.cell_show_element.getElementsByTagName("p")[0];
        p.textContent = this.value.energy;
    }

    setCorpseRobot(value){
        this.cell_show_element.setAttribute("class", "game-board-cell game-board-cell-robot-corpse");
        this.value = value;
        let p = this.cell_show_element.getElementsByTagName("p")[0];
        p.textContent = this.value.energy;
    }
}

class GameBoard{
    constructor() {
        this.board_cells = [];
    }

    initBoard(){
        this.board_cells = [];

        let game_board_field = document.getElementById("game-board");
        game_board_field.innerHTML = "";

        for(let y = 0; y < height; y++){
            let line_div = document.createElement("div");
            line_div.setAttribute("class", "game-board-line");
            let line_cells = [];
            for(let x = 0; x < width; x++){
                let cell_div = document.createElement("div");
                cell_div.setAttribute("class", "game-board-cell");

                let cell_p = document.createElement("p");
                // cell_p.textContent = "301";
                cell_div.appendChild(cell_p);

                line_div.appendChild(cell_div);
                line_cells.push(new Cell(cell_div));
            }
            game_board_field.appendChild(line_div);
            this.board_cells.push(line_cells);
        }
        // this.board_cells[1][1].setVeganRobot();
        // this.board_cells[1][1].setNullRobot();
        // this.board_cells[1][2].setVeganRobot();
        // this.board_cells[1][3].setCorpseRobot();
        // this.board_cells[1][4].setHunterRobot();
        this.board_cells[5][3].value = new VeganRobot();
        this.board_cells[4][3].value = new VeganRobot();
        this.board_cells[3][3].value = new VeganRobot();
        this.board_cells[2][3].value = new VeganRobot();
        this.board_cells[height - 1][5].value = new Hunter();
        this.board_cells[height - 1][6].value = new Hunter();
        this.board_cells[height - 1][7].value = new Hunter();
        this.board_cells[height - 1][8].value = new Hunter();
        // console.log(this.board_cells)
    }

    updateBoard(){
        let updating_robots = []
        for(let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (!((this.board_cells[y][x]).isCellBusy()))
                    continue;
                if (!this.board_cells[y][x].value.isUpdateComplete) {
                    this.board_cells[y][x].value.isUpdateComplete = true;
                    updating_robots.push(this.board_cells[y][x].value);
                    this.board_cells[y][x].value.updateRobot(x, y, this.board_cells);
                }
            }
        }
        for (let i = 0; i < updating_robots.length; i++){
            updating_robots[i].isUpdateComplete = false;
        }
        let all_robot_count = document.getElementById("all-robot-count");
        all_robot_count.textContent = " All robot count : " + updating_robots.length;
    }
}

const gameboard = new GameBoard();
gameboard.initBoard();
setInterval(()  => { gameboard.updateBoard() }, 50);