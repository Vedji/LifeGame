let game_speed = 1;                                 // Скорость игры
const width = 32;                                   // Ширина игрового поля
const height = 32;                                  // Высота игрового поля
const robotEnergy = 300;                            // Стартовая энергия робота
const genomeLength = 64;                            // Длинна генома
const genomeRuleMax = 32;                           // Максимальное значение в ячейки генома
const randomChildGenome = 4;                        // Сколько ген будет заменено у ребенка
const childAppendEnergyThreshold = 600;             // Порог при котором клетка будет пытаться заспавнить новую клетку
const childEnergy = 300;                            // Сколько энергии клетка отдаст своему клону
const moveEnergyCost = 10;                          // Сколько энергии нужно для перемещения клетки
const energyPerTurn = 10;                           // Сколько энергии добавляется каждый ход
const corpseEnergyBase = robotEnergy;               // Сколько изначально энергии у мертвого робота
const corpseEnergyRemovedPerTick = 10;              // Сколько энергии убывает кажщдый тик у мертвой клетки
const hunterEnergyMoveCost = 5;                     // Сколько энергии потребляет охотник за ход
const hunterStartedEnergy = 300;                    // Стартовое количество энергии охотника
const childHunterAppendEnergyThreshold = 1600;      // Порог при котором клетка будет пытаться заспавнить новую клетку
const childHunterEnergy = 300;                      // Сколько энергии клетка отдаст своему клону
let turnToDie = 250;                                // Ходов до того, как клетка перестане получать энергию с поля
let mouse_mode = "game-settings";                     // Режим нажатия мыши на ячейку

let ROBOT_START_ENERGY = 300;
let ROBOT_TURN_TO_DIE = 400;
let ROBOT_ENERGY_THRESHOLD_CHILD = 600;
let ROBOT_ENERGY_SHARED = 0.15;
let ROBOT_ENERGY_SPELLS = 10;
let ROBOT_ENERGY_APPEND = 5;
let ROBOT_GEN_COUNT_MODIFY = 5;

let CORPSE_ROBOT_START_ENERGY = 300;
let CORPSE_ROBOT_TURN_TO_DIE = 400;

let VEGAN_ROBOT_START_ENERGY = 300;
let VEGAN_ROBOT_TURN_TO_DIE = 400;
let VEGAN_ROBOT_ENERGY_THRESHOLD_CHILD = 600;
let VEGAN_ROBOT_ENERGY_SHARED = 0.15;
let VEGAN_ROBOT_ENERGY_SPELLS = 10;
let VEGAN_ROBOT_ENERGY_APPEND = 5;

let HUNTER_ROBOT_START_ENERGY = 300;
let HUNTER_ROBOT_TURN_TO_DIE = 400;
let HUNTER_ROBOT_ENERGY_THRESHOLD_CHILD = 600;
let HUNTER_ROBOT_ENERGY_SPELLS = 10;
let HUNTER_ROBOT_ENERGY_APPEND = 5;



class Robot {
    constructor(energy = null, genome = null) {
        this.energy = energy === null ? ROBOT_START_ENERGY : energy;
        this.genome = genome !== null ? genome : this.generateGenome();
        this.turn = 0;
        this.turns_count = 0;
        this.robotType = "robot";
        this.robot_commands = {
            0: "up-left",
            1: "up",
            2: "up-right",
            3: "right",
            4: "down-right",
            5: "down",
            6: "down-left",
            7: "left",
            8: "move",
            9: "share-energy"
        };
        this.isUpdateComplete = false;
        this.show_genome = document.getElementById("show-genome-robot");

        this.c_energy_started = ROBOT_START_ENERGY;
        this.c_turn_to_die = ROBOT_TURN_TO_DIE;
        this.c_energy_threshold_child = ROBOT_ENERGY_THRESHOLD_CHILD;
        this.c_energy_shared = ROBOT_ENERGY_SHARED;
        this.c_energy_spells = ROBOT_ENERGY_SPELLS;
        this.c_energy_append = ROBOT_ENERGY_APPEND;
        this.c_gen_modifed_count = ROBOT_GEN_COUNT_MODIFY;
    }

    generateGenome(){
        let new_genome = [];
        for (let i = 0; i < genomeLength; i++){
            new_genome.push(Math.floor(Math.random() * (genomeRuleMax + 1)));
        }
        return new_genome;
    }

    appendChildToField(x, y, new_x, new_y, field, new_genome){
        if (x === new_x && y === new_y)
            return;
        this.energy = this.energy - this.c_energy_threshold_child;
        field[new_y][new_x].setRobot(new Robot(this.c_energy_started, new_genome));
        field[new_y][new_x].updateCell();
    }

    getCellByDirection(command, x, y){
        let dx = x;
        let dy = y;
        switch (command) {
            case "up":
                dx = x;
                dy = y;
                if (y - 1 >= 0)
                    dy = y - 1;
                break;
            case "down":
                dx = x;
                dy = y;
                if (y + 1 < height)
                    dy = y + 1;
                break;
            case "left":
                dx = x;
                dy = y;
                if (x - 1 < 0)
                    dx = width - 1;
                if (x - 1 >= 0)
                    dx = x - 1;
                break;
            case "right":
                dx = x;
                dy = y;
                if (x + 1 >= width)
                    dx = 0;
                if (x + 1 < width)
                    dx = x + 1;
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
                break;
        }
        return {"dx": dx, "dy": dy, "notMove": x === dx && y === dy}
    }

    appendChild(x, y, field){
        let new_genome = [...this.genome];
        for (let i = 0; i < this.c_gen_modifed_count; i++){
            let random_gen = Math.floor(Math.random() * (genomeLength + 1));
            new_genome[random_gen] = Math.floor(Math.random() * (genomeRuleMax + 1));
        }
        let directions = ["up-left", "up", "up-right", "right", "down-right", "down", "down-left", "left"]
        for (let i = 0; i < directions.length; i++){
            let buffer = this.getCellByDirection(directions[i], x, y);
            if (buffer["notMove"] || field[buffer["dy"]][buffer["dx"]].isCellBusy())
                continue;
            this.appendChildToField(x, y, buffer["dx"], buffer["dx"], field, new_genome);
            break;
        }
    }

    _move(command, x, y, field){
        let moved_cell_coords = this.getCellByDirection(command, x, y);
        if (moved_cell_coords["notMove"])
            return moved_cell_coords;
        let moved_cell = field[moved_cell_coords["dy"]][moved_cell_coords["dx"]];
        if (moved_cell.isCellBusy() && moved_cell.value.robotType === "corpse"){
            moved_cell.setNullRobot();
        }
        if (moved_cell.isCellBusy())
            return moved_cell_coords;
        moved_cell.setRobot(this);
        field[y][x].setNullRobot();
        return moved_cell_coords;
    }

    move(x, y, field){
        let current_turn = this.next_turn(this.turn);
        let command_moved = this.robot_commands[this.genome[current_turn] % 8];
        return this._move(command_moved, x, y, field);
    }
    shareEnergy(x, y, field){
        let directions = ["up-left", "up", "up-right", "right", "down-right", "down", "down-left", "left"]
        for (let i = 0; i < directions.length; i++) {
            let buffer = this.getCellByDirection(directions[i], x, y);
            let other_robot = field[buffer["dy"]][buffer["dx"]];
            if (buffer["notMove"] || !other_robot.isCellBusy())
                continue;
            if (other_robot.robotType === this.robotType){
                let send_energy = Math.floor(this.energy * this.c_energy_shared);
                this.energy -= send_energy;
                other_robot.energy += send_energy;
            }
        }
    }

    next_turn(turn){
        turn = this.genome[turn] % 9 + turn + 1;
        if (turn >= genomeLength)
            turn = turn % genomeLength;
        return turn;
    }

    robotEnergyEat(x, y, field){
        this.energy = this.energy - this.c_energy_spells;
    }
    robotEnergyAppend(x, y, field){
        let form_y = ((16 + y)/ -100) * (y - 12);
        if (form_y > 0)
            this.energy += Math.floor(this.c_energy_append * form_y);

        // let y_level = (y % 8) / 8;
        // y_level = energyPerTurn * y_level + 1;
        // this.energy += Math.floor(y_level);

    }

    dieRobot(x, y, field){
        if (this.energy > 0)
            return false;
        field[y][x].setCorpseRobot(new Corpse( CORPSE_ROBOT_START_ENERGY ));
        this.show_genome.innerHTML = "";
        let p = document.createElement("p");
        p.textContent = this.genome;
        this.show_genome.appendChild(p)
        return true;
    }

    updateRobot(x, y, field){
        this.robotEnergyEat(x, y, field);
        if (this.turns_count < this.c_turn_to_die)
            this.robotEnergyAppend(x, y, field);
        if (this.dieRobot(x, y, field))
            return true;

        if (this.energy > childAppendEnergyThreshold)
            this.appendChild(x, y, field);

        let rule = this.genome[this.turn];
        switch (this.robot_commands[rule]) {
            case "move":

                let coords = this.move(x, y, field);
                x = coords["dx"];
                y = coords["dy"];
                break;
            case "share-energy":
                this.shareEnergy(x, y, field);
                break;
        }
        this.turns_count += 1;
        this.turn = this.next_turn(this.turn);
        field[y][x].updateCell();
        return false;
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
        this.energy = energy === null ? corpseEnergyBase : energy;
        this.robotType = "corpse";
        this.show_genome = document.getElementById("show-genome-hunter");

    }

    dieRobot(x, y, field){
        if (this.energy > 0)
            return false;
        field[y][x].setNullRobot();
        return true;
    }

    updateRobot(x, y, field){
        this.energy -= corpseEnergyRemovedPerTick;
        if (this.dieRobot(x, y, field))
            return true;
        if (this.energy > childAppendEnergyThreshold)
            this.appendChild(x, y, field);
        let coords = this._move("down", x, y, field);
        x = coords["dx"];
        y = coords["dy"];
        field[y][x].updateCell();
        return false;
    }
}


class Hunter extends Robot{
    constructor(energy = null, genome = null) {
        super(energy === null ? hunterStartedEnergy : energy, genome);
        this.robotType = "hunter";
        this.show_genome = document.getElementById("show-genome-hunter");
        this.robot_commands = {
            0: "up-left",
            1: "up",
            2: "up-right",
            3: "right",
            4: "down-right",
            5: "down",
            6: "down-left",
            7: "left",
            8: "move"
        }
    }

    appendChildToField(x, y, new_x, new_y, field, new_genome){
        if (x === new_x && y === new_y)
            return;
        this.energy = this.energy - childEnergy;
        field[new_y][new_x].setRobot(new Hunter(childEnergy, new_genome));
        field[new_y][new_x].updateCell();
    }

    _move(command, x, y, field){
        let moved_cell_coords = this.getCellByDirection(command, x, y);
        if (moved_cell_coords["notMove"])
            return moved_cell_coords;
        let moved_cell = field[moved_cell_coords["dy"]][moved_cell_coords["dx"]];
        if (moved_cell.isCellBusy() && moved_cell.value.robotType === "corpse"){
            this.energy += moved_cell.value.energy;
            moved_cell.setNullRobot();
        }
        if (moved_cell.isCellBusy() && moved_cell.value.robotType === "vegan"){
            this.energy += moved_cell.value.energy + corpseEnergyBase;
            moved_cell.setNullRobot();
        }
        if (moved_cell.isCellBusy())
            return moved_cell_coords;
        moved_cell.setRobot(this);
        field[y][x].setNullRobot();
        return moved_cell_coords;
    }

    robotEnergyEat(x, y, field) {
        this.energy -= hunterEnergyMoveCost;
    }

    updateRobot(x, y, field){
        this.robotEnergyEat(x, y, field);
        if (this.turns_count < turnToDie)
            this.robotEnergyAppend(x, y, field);
        if (this.dieRobot(x, y, field))
            return true;

        if (this.energy > childAppendEnergyThreshold)
            this.appendChild(x, y, field);

        let rule = this.genome[this.turn];
        switch (this.robot_commands[rule]) {
            case "move":
                let coords = this.move(x, y, field);
                x = coords["dx"];
                y = coords["dy"];
                break;
        }
        this.turns_count += 1;
        this.turn = this.next_turn(this.turn);
        field[y][x].updateCell();
        return false;
    }
}


class Cell {
    constructor(cell_show_element, cell_value = null) {
        this.value = cell_value;
        this.cell_show_element = cell_show_element;

        this.cell_show_element.addEventListener("click", () => {
            switch (mouse_mode) {
                case "del-robot":
                    this.setNullRobot();
                    break;
                case "set-corpse-robot":
                    let corpse_energy = document.getElementById("select-mouse-mode-menu-set-corpse-robot-energy");
                    this.setCorpseRobot(new Corpse(corpse_energy.value === "" ? 0 : corpse_energy.value));
                    break;
                case "set-hunter-robot":
                    let hunter_energy = document.getElementById("select-mouse-mode-menu-set-hunter-robot-energy").value;
                    let hunter_genome = [];
                    for (let item of document.getElementById("select-mouse-mode-menu-set-hunter-robot-genome").getElementsByTagName("input"))
                        hunter_genome.push( item.value === "" || item.value < 0 || item.value >= genomeRuleMax ? 0 : item.value);
                    this.setHunterRobot(new Hunter(hunter_energy === "" ? hunterStartedEnergy : hunter_energy, hunter_genome));
                    break;
                case "set-vegan-robot":
                    let vegan_energy = document.getElementById("select-mouse-mode-menu-set-vegan-robot-energy").value;
                    let vegan_genome = [];
                    for (let item of document.getElementById("select-mouse-mode-menu-set-vegan-robot-genome").getElementsByTagName("input"))
                        vegan_genome.push( item.value === "" || item.value < 0 || item.value >= genomeRuleMax ? 0 : item.value);
                    this.setVeganRobot(new VeganRobot(vegan_energy === "" ? robotEnergy : vegan_energy, vegan_genome));
                    break;
                case "show-robot-genome":
                    if(!this.isCellBusy())
                        break;
                    if (this.value.robotType === "corpse")
                        break;
                    let gen_case = document.getElementById("select-mouse-mode-menu-see-robot-genome");
                    gen_case.innerHTML = "";
                    for (let i = 0; i < genomeLength; i++){
                        let gen_see = document.createElement("input");
                        gen_see.setAttribute("type", "number");
                        gen_see.setAttribute("min", "0");
                        gen_see.setAttribute("max", genomeRuleMax + "");
                        gen_see.setAttribute("step", "1");
                        gen_see.setAttribute("class", "gen-input-cell")
                        gen_see.value = this.value.genome[i];
                        gen_case.appendChild(gen_see);
                    }
                    let robot_energy = document.getElementById("select-mouse-mode-menu-see-robot-energy");
                    this.value.energy = robot_energy.value;
                    document.getElementById("select-mouse-mode-menu-see-robot-genome-accept").addEventListener("click", () => {
                        let robot_energy = document.getElementById("select-mouse-mode-menu-see-robot-energy").value;
                        let robot_genome = [];
                        for (let item of document.getElementById("select-mouse-mode-menu-see-robot-genome").getElementsByTagName("input"))
                            robot_genome.push( item.value === "" || item.value < 0 || item.value >= genomeRuleMax ? 0 : item.value);
                        this.value.energy = robot_energy === "" ? this.value.energy : robot_energy;
                        this.value.genome = robot_genome;
                        this.updateCell();
                        // this.setVeganRobot(new VeganRobot(robot_energy === "" ? robotEnergy : vegan_energy, vegan_genome));
                    })
                    this.updateCell();
                    break;


            }
            // this.value = new Hunter();
        })
    }


    isCellBusy(){
        return this.value !== null;
    }

    updateCell(){
        if (!this.isCellBusy()){
            this.setNullRobot();
            return;
        }
        let p = this.cell_show_element.getElementsByTagName("p")[0];
        p.textContent = this.value.energy;
        switch (this.value.robotType) {
            case "robot":
                break;
            case "vegan":
                this.setVeganRobot(this.value);
                break;
            case "hunter":
                this.setHunterRobot(this.value);
                break;
            case "corpse":
                this.setCorpseRobot(this.value);
                break;
        }

    }

    setRobot(value){
        this.value = value;
        this.cell_show_element.setAttribute("class", "game-board-cell");
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
        this.last_alive = null;
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
                line_cells.push(new Cell(cell_div, null));
            }
            game_board_field.appendChild(line_div);
            this.board_cells.push(line_cells);
        }
        // this.board_cells[1][1].setVeganRobot();
        // this.board_cells[1][1].setNullRobot();
        // this.board_cells[1][2].setVeganRobot();
        // this.board_cells[1][3].setCorpseRobot();
        // this.board_cells[1][4].setHunterRobot();
        this.board_cells[5][7].value = new VeganRobot(100,
            [8, 8, 8, 8, 8, 8, 8, 8, 8,
                8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]);
        this.board_cells[2][10].value = new VeganRobot();
        this.board_cells[3][15].value = new VeganRobot();
        this.board_cells[2][19].value = new VeganRobot();
        // this.board_cells[height - 1][5].value = new Hunter();
        // this.board_cells[height - 1][6].value = new Hunter();
        // this.board_cells[height - 1][7].value = new Hunter();
        // this.board_cells[height - 1][8].value = new Hunter();
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
                    let robot_updating = this.board_cells[y][x].value;
                    updating_robots.push(robot_updating);
                    if (robot_updating.updateRobot(x, y, this.board_cells)){
                        switch (robot_updating.robotType) {
                            case "vegan":
                                this.last_alive = robot_updating.genome;
                                break;
                        }
                    }
                }
            }
        }
        for (let i = 0; i < updating_robots.length; i++){
            updating_robots[i].isUpdateComplete = false;
        }
        let all_robot_count = document.getElementById("all-robot-count");
        all_robot_count.textContent = " All robot count : " + updating_robots.length;
        if (updating_robots.length === 0)
            this.reloadBoard();
    }

    reloadBoard(){
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++) {
                this.board_cells[y][x].setNullRobot();
            }
        }
        if (this.last_alive !== null){
            for (let i = 0; i < 4; i++){
                let x = Math.floor(Math.random() * (width - 1));
                let y = Math.floor(Math.random() * (height - 1));
                this.board_cells[y][x].setRobot(new VeganRobot(robotEnergy, this.last_alive));
            }
        }
        for (let i = 0; i < 8; i++){
            let x = Math.floor(Math.random() * (width - 1));
            let y = Math.floor(Math.random() * (height - 1));
            this.board_cells[y][x].setRobot(new VeganRobot());
        }
    }
}


const game_board = new GameBoard();
game_board.initBoard();
let game_interval = setInterval(()  => { game_board.updateBoard() }, game_speed);

document.getElementById("reload-game").addEventListener("click", () => {
    game_board.initBoard();
});
document.getElementById("show-game-speed").textContent = " Game speed: " + game_speed;
document.getElementById("edit-game-speed").oninput = (ev) => {
    document.getElementById("show-game-speed").textContent = " Game speed: " + ev.target.value;
    game_speed = ev.target.value;
    if (game_interval === null)
        return;
    clearInterval(game_interval);
    game_interval = setInterval(()  => { game_board.updateBoard() }, game_speed);
};
document.getElementById("pause-game").addEventListener("click", (ev) => {
    if (!ev.target.hasAttribute("data-status"))
        return;
    let status = ev.target.getAttribute("data-status");
    if (status === "play"){
        clearInterval(game_interval);
        game_interval = null;
        ev.target.setAttribute("data-status", "stop");
        ev.target.textContent = "Stop";
    }
    if (status === "stop"){
        game_interval = setInterval(()  => { game_board.updateBoard() }, game_speed);
        ev.target.setAttribute("data-status", "play");
        ev.target.textContent = "Play";
    }
});

document.getElementById("select-mouse-mode-menu-set-hunter-robot-genome-random").addEventListener("click", () => {
    let hunter_gen = document.getElementById("select-mouse-mode-menu-set-hunter-robot-genome");
    for (let item of hunter_gen.getElementsByTagName("input")){
        item.value = "" + Math.floor(Math.random() * (genomeRuleMax - 1));
    }
});
document.getElementById("select-mouse-mode-menu-set-hunter-robot-genome-clear").addEventListener("click", () => {
    let hunter_gen = document.getElementById("select-mouse-mode-menu-set-hunter-robot-genome");
    for (let item of hunter_gen.getElementsByTagName("input")){
        item.value = "";
    }
});

document.getElementById("select-mouse-mode-menu-set-vegan-robot-genome-random").addEventListener("click", () => {
    let hunter_gen = document.getElementById("select-mouse-mode-menu-set-vegan-robot-genome");
    for (let item of hunter_gen.getElementsByTagName("input")){
        item.value = "" + Math.floor(Math.random() * (genomeRuleMax - 1));
    }
});
document.getElementById("select-mouse-mode-menu-set-vegan-robot-genome-clear").addEventListener("click", () => {
    let hunter_gen = document.getElementById("select-mouse-mode-menu-set-vegan-robot-genome");
    for (let item of hunter_gen.getElementsByTagName("input")){
        item.value = "";
    }
});


document.getElementById("select-mouse-mode").onchange = (ev) => {
    mouse_mode = ev.target.options[ev.target.selectedIndex].value;
    let items = {
        "set-corpse-robot": document.getElementById("select-mouse-mode-menu-set-corpse-robot"),
        "set-hunter-robot": document.getElementById("select-mouse-mode-menu-set-hunter-robot"),
        "set-vegan-robot": document.getElementById("select-mouse-mode-menu-set-vegan-robot"),
        "show-robot-genome": document.getElementById("select-mouse-mode-menu-see-gen-robot"),
        "game-settings": document.getElementById("select-mouse-mode-menu-game-settings")
    };
    for (let mouse_menu_item of Object.values(items))
        mouse_menu_item.style.display = "none";
    switch (mouse_mode) {
        case "game-settings":
            items["game-settings"].style.display = "block";
            break;
        case "set-corpse-robot":
            items["set-corpse-robot"].style.display = "block";
            break;
        case "set-hunter-robot":
            items["set-hunter-robot"].style.display = "block";
            let gen_case_hunter = document.getElementById("select-mouse-mode-menu-set-hunter-robot-genome");
            gen_case_hunter.innerHTML = "";
            for (let i = 0; i < genomeLength; i++){
                let gen_inp = document.createElement("input");
                gen_inp.setAttribute("type", "number");
                gen_inp.setAttribute("min", "0");
                gen_inp.setAttribute("max", genomeRuleMax + "");
                gen_inp.setAttribute("step", "1");
                gen_inp.setAttribute("class", "gen-input-cell")
                gen_case_hunter.appendChild(gen_inp);
            }
            break;
        case "set-vegan-robot":
            items["set-vegan-robot"].style.display = "block";
            let gen_case_vegan = document.getElementById("select-mouse-mode-menu-set-vegan-robot-genome");
            gen_case_vegan.innerHTML = "";
            for (let i = 0; i < genomeLength; i++){
                let gen_inp = document.createElement("input");
                gen_inp.setAttribute("type", "number");
                gen_inp.setAttribute("min", "0");
                gen_inp.setAttribute("max", genomeRuleMax + "");
                gen_inp.setAttribute("step", "1");
                gen_inp.setAttribute("class", "gen-input-cell")
                gen_case_vegan.appendChild(gen_inp);
            }
            break;
        case "show-robot-genome":
            items["show-robot-genome"].style.display = "block";
            let gen_case = document.getElementById("select-mouse-mode-menu-see-robot-genome")
            gen_case.innerHTML = "";
            let robot_energy = document.getElementById("select-mouse-mode-menu-see-robot-energy");
            robot_energy.value = "";
            break;

    }
};