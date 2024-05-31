# Luna Project
Source code of Luna development project. This is an experimental project that can be abandoned at any time. Please do not claim this project as your own, I am not responsible for any misuse of this project.

## Directory Meaning


| Name | Description|
|------|------------|
| src | Main Directory|
| lib | Lib / Mod Files Directory |
| commands | Commands Directory |
| controller | Controler Files Directory |
| database | Database Files Directory |
| session | Session Directory |

## Guide For Development

Before that, some required modules need to be installed; make sure you install them first.

> **Note for developer**

> Luna uses cookies for login, make sure to copy them first. Log in to your development account and go to the "c3c-fbstate" extension for get cookies. If you don't have it, you can install it yourself [here.](https://github.com/c3cbot/c3c-fbstate)

### Cookies

Luna uses cookies for login. Make sure you save the cookies to a file and copy the file path to `Clients()` `index.js line 4`.

### Starting project

If you feel everything is completed and ready, then proceed to the next step, which is to start the program.

To start it, you can use the command `npm run dev`, `yarn run dev`, or `pnpm run dev` depending on the package manager you are using.


# Documentation

## CommandsBuilder Class Documentation

The `CommandsBuilder` class is used to build and configure command objects. It provides methods to set various properties of a command, such as name, description, permissions, arguments, group, price, cooldown, and the function to run when the command is executed.

### Constructor

#### `constructor(name: string)`

- Creates a new `CommandsBuilder` instance with the specified command name.
- Initializes default values for other properties.

### Methods

#### `description(desc: string)`

- Sets the description of the command.
- Parameters:
  - `desc` (string): The description of the command.
- Returns: The `CommandsBuilder` instance for method chaining.

#### `permissions(perm: number)`

- Sets the permission level required to use the command.
- Parameters:
  - `perm` (number): The permission level (0, 1, or 2) required to use the command.
- Returns: The `CommandsBuilder` instance for method chaining.

#### `arguments(arg: string[])`

- Sets the arguments for the command.
- Parameters:
  - `arg` (array): An array of argument names for the command.
- Returns: The `CommandsBuilder` instance for method chaining.

#### `groups(name: string)`

- Sets the group name for the command.
- Parameters:
  - `name` (string): The name of the group to which the command belongs.
- Returns: The `CommandsBuilder` instance for method chaining.

#### `prices(num: number)`

- Sets the price of the command.
- Parameters:
  - `num` (number): The price of the command in some currency (e.g., yen).
- Returns: The `CommandsBuilder` instance for method chaining.

#### `cooldown(sec: number)`

- Sets the cooldown period (in seconds) for the command.
- Parameters:
  - `sec` (number): The cooldown period in seconds.
- Returns: The `CommandsBuilder` instance for method chaining.

#### `runs(func: function)`

- Sets the function to be executed when the command is run.
- Parameters:
  - `func` (function): The function to run when the command is executed.
- Returns: The `CommandsBuilder` instance for method chaining.

### Example Usage

```javascript
const myCommand = new CommandsBuilder("myCommand")
    .description("This is a sample command.")
    .permissions(1)
    .arguments(["arg1", "arg2"])
    .groups("Sample Group")
    .prices(5)
    .cooldown(10)
    .runs((client, events, args) => {
        // Custom command logic goes here
    });
```# LunaHaru
# LunaHaruka
# LunaHaruka
