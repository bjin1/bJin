![Logo](https://raw.githubusercontent.com/bjin1/bJin/main/docs/bjin.png)

# bJin

bJin is a custom language, which learn a lot from `python` and try to build a `javascript` logic but with a simple grammer coding language.

## List of Features

- func declare: `def identifier (identifier, ...) ... fed`
- if statement: `if statement : statement; statement; ...  (ei statement : statement ...) (el statement ... le) fi`
- use `write` to print something, and `get` to wait for input.
- use `out` as `return`
- statement end with semicolon.

## Example Programs

Here are some examples, Goof3 on the left, JavaScript on the right.

### "Hello World" Example

- Declare print statements with "poof"

<table>
  <tr>
  <th>Goof3</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td>

```
write("hello world!");
```

  </td>

  <td>

```javascript
console.log('hello world!')
```

  </td>

  </tr>
</table>

### Function Example


<table>
  <tr>
  <th>Goof3</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td>

```
def myFunc(x, y, z) 
  out x + y;
fed
```

  </td>

  <td>

```javascript
function myFunc(x, y, z) {
  return x + y;
}
```

  </td>

  </tr>
</table>

### Declaration Example

- use `give` as a declaration sign, the type will be automatically identified

<table>
  <tr>
  <th>Goof3</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td>

```
give money 20.25;
give age 21;
give kevin true;
give simmons "Lumberjack"
```

  </td>

  <td>

```javascript
var money = 20.25;
var age = 21;
var kevin = true;
var simmons = "Lumberjack";
```
  </td>
  </tr>
</table>
