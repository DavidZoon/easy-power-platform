export function powerFxIdentifier(name) {
  return /^[A-Za-z_][A-Za-z_0-9]*$/.test(name) && !/^(?:true|false|blank|as|in|exactin|and|or|not|self|parent|thisrecord|thisitem)$/i.test(name)
    ? name : "'" + name.replaceAll("'", "''") + "'";
}
