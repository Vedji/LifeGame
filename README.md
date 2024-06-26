# Genetic life game

## Описание

Игра представляет собой симуляцию с игровым полем, клеточными автоматами и их взаимодействиями. Поле состоит из клеток, по которым перемещаются два типа автоматов: Vegan и Hunter, а также могут находиться мертвые клетки, называемые Corpse. Вот описание основных элементов и правил игры:

### Игровой процесс
1. **Ходы автоматов**: каждое действие определяется геномом. Автоматы могут двигаться, получать энергию или взаимодействовать с другими автоматами.
2. **Энергия и размножение**: Vegan автоматы получают энергию с поля и могут размножаться, изменяя геном потомков. Hunter автоматы охотятся на Vegan автоматов для получения энергии.
3. **Смерть и разложение**: когда автомат теряет всю энергию, он превращается в Corpse, который постепенно разлагается, исчезая с поля.

### Игровое поле
- **Поле**: двумерная сетка, где клетки обозначены координатами (x, y), отсчитываемыми от верхнего левого угла.
- **Горизонтальные границы**: при достижении автоматом края поля по горизонтали он появляется на противоположной стороне.
- **Вертикальные границы**: автомат не может перемещаться выше верхнего или ниже нижнего края поля.

### Клеточные автоматы
#### Общие
 - **Передвижение** передвижение происходит командами, 0 до `genMaxRule`, то в каком направлении будет ходить автомат, определяеться по формуле `dir = gen % 8`, где gen - значение гена текущего хода, а dir может принимать следующие значения:

| dir | Направление  |
|----:|:-------------|
|   0 | Вверх-влево  |
|   1 | Вверх        |
|   2 | Вверх-вправо |
|   3 | Вправо       |
|   4 | Вниз-вправо  |
|   5 | Вниз         |
|   6 | Вниз-вправо  |
|   7 | Вправо       |


Например, текущий ген равен **8** по индексу **0**, значит, следующая команда находиться по индексу `i(8) = 8 % 9 + 0 + 1 = 9`, 
где **8** - значение текущего гена, **0** - индекс текущего хода, **9** и **1** - константа, в результате мы получаем индекс следующего гена.
Предположим, что на этом значении стоит число **18**, тогда `dir` будет равен **2**, т. е. клетка передвинеться **вверх-вправо**.

- **Размножение**: когда достигает определенного количества энергии, создает себе подобных с изменением генома (определяется переменной \*\*\*_ROBOT_GEN_COUNT_MODIFY).
- **Геном**: целочисленный массив, определяющий поведение автоматов. Числа в массиве находятся в диапазоне от 0 до **genomeMaxRule**.
- **Правила поведения**: каждый ход определяется формулой:
  ```
  next_turn = genome[turn] % 9 + turn + 1;
  ```
  где `next_turn` - текущий индекс генома, который указывает индекс следующего действия в геноме, genome - геном клетки, turn - текущий ход.

#### Vegan
- **Энергия**: получает пасивно, по формуле: `delta_energy = (16 + y) * -0.01 * (y - 12) * c_energy_append`. Добавление энергии автомату, происходит только в случае, если `delta_energy > 0`
  где \( y \) - координата клетки, а `c_energy_append` - коэффициент добавления энергии.

- **Передача энергии**: может передавать часть своей энергии другим Vegan автоматам. Передаваемая энергия определяеться по формуле: `send_energy = energy * c_energy_shared`, где `send_energy` - сколько энергии будет отправлено другому автомату и столько же будет забрано у этого автомата, `energy` - энергия делющегося автомата, `c_energy_shared` - коофицент передачи.
- **Смерть**: после определенного количества ходов (VEGAN_ROBOT_TURN_TO_DIE) перестает получать пассивно энергию. При достижение энергии равной или меньшей нулю - автомат превращается в **Corpse**.

#### Hunter
- **Энергия**: получает энергию от клеток Vegan, на которых охотится, по формуле:
  ```
  energy += moved_cell_energy + VEGAN_ROBOT_START_ENERGY;
  ```
  где, **energy** - собственная энергия автомата, **moved_cell_energy** - энергия Vegan автомата и  VEGAN_ROBOT_START_ENERGY - стартовая энергия Vegan автомата.
- **Размножение** происходит так же как и у Vegan-автомата.
- **Смерть**: превращается в Corpse, если энергия становится <= 0.

### Corpse
- **Мертвые клетки**: появляются, когда Vegan или Hunter автомат умирает (энергия <= 0).
- **Энергия**: стартовое значение энергии равно переменной **CORPSE_ROBOT_START_ENERGY**.
- **Уменьшение энергии**: каждый такт энергия уменьшается на **CORPSE_ROBOT_ENERGY_SPELLS**.
- **Исчезновение**: когда энергия Corpse становится равной или меньше 0 или Если количество ходов превысило значение переменной **CORPSE_ROBOT_TURN_TO_DIE**, клетка исчезает с игрового поля.


### Пример работоспособности
На скриншоте предоставлен скришот работы программы. Зеленые клетки это Vegan-автоматы, Красные это Hunter-автоматы, а  серые это отработовшие автоматы.
![Пример результата](/doc/game_screen_2.jpg)
