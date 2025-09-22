

exports.cleanLowerCase = (val)=>{
  let str = val.trim();
  str = str.toLowerCase();
  return str;
}

exports.sanitizeFileName = (string)=>{
  if(!string) return 'untitled';

  let str = string.trim();
  str = str.replace(/\s+/g, '_');
  str = str.toLowerCase()
  return str
}

exports.Capitalize = (string)=>{
  let str = string.trim();
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

exports.makeSlugType = (string)=>{
  if(!string) return 'untitled';

  let str = string.trim();
  str=str.replace(/\s+/g, '-');
  str = str.toLowerCase()
  return str
}