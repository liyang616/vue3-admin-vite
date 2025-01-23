import xlsx from "xlsx";
import fs from "fs";

// 语言包
export const updateLanguage = (filePath: string, outPath?: string) => {
  const languageFile = xlsx.readFile(filePath);
  const sheetNames = languageFile.SheetNames;
  const _json: any[] = [];

  sheetNames.forEach((sheet: string) => {
    _json.push(...xlsx.utils.sheet_to_json(languageFile.Sheets[sheet]));
  });

  const _exceptName = "字段";
  const firstSheets = _json[0];

  const _obj: { [key: string]: { [key: string]: string } } = {};

  _json.forEach((item: any) => {
    for (const name in firstSheets) {
      if (firstSheets.hasOwnProperty(name)) {
        const sheet = firstSheets[name]?.replace(/\s/g, "");
        const _i18nKey = item[_exceptName]?.replace(/\s/g, "");

        // 过滤指定字段和空__EMPTY字段
        if (_i18nKey && sheet && name !== _exceptName && name !== "__EMPTY") {
          if (!_obj[sheet]) {
            _obj[sheet] = {};
          }

          let _toVal: string = item[name].toString();

          // 过滤#包含的注释，如：#code#
          if (_toVal?.includes("#")) {
            const _firstIn = _toVal.indexOf("#");
            const _lastIn = _toVal.lastIndexOf("#");
            if (_firstIn !== _lastIn) {
              _toVal = _toVal.replace(_toVal.slice(_firstIn, _lastIn + 1), "");
            }
          }

          _obj[sheet][_i18nKey] = _toVal;
        }
      }
    }
  });

  fs.writeFile(outPath || filePath, JSON.stringify(_obj, null, 2), err => {
    if (err) {
      console.log("写入失败", err);
    }
  });
};
