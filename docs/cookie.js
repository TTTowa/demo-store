class CookieCacheManager {
    // Cookieにデータを設定
    static setItem(key, value, days) {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      // 配列の場合、JSON文字列に変換
      const valueToStore = Array.isArray(value) ? JSON.stringify(value) : value;
      document.cookie = key + "=" + (valueToStore || "")  + expires + "; path=/";
    }
  
    // Cookieからデータを取得
    static getItem(key) {
      const nameEQ = key + "=";
      const ca = document.cookie.split(';');
      for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          const value = c.substring(nameEQ.length, c.length);
          try {
            // JSONパースして配列に戻す
            return JSON.parse(value);
          } catch(e) {
            return value;
          }
        }
      }
      return null;
    }
  
    // Cookieからデータを削除
    static removeItem(key) {
      document.cookie = key + '=; Max-Age=-99999999;';
    }
  
    // Cookieが存在するかチェック
    static hasItem(key) {
      return this.getItem(key) !== null;
    }
  
    // 配列にエントリを追加
    static addToArray(key, entry, maxEntries, days) {
      let array = this.getItem(key);
      if (!Array.isArray(array)) {
        array = [];
      }
      array.push(entry);
      if (array.length > maxEntries) {
        array = array.slice(-maxEntries); // 最大エントリ数を超えたら古いものを削除
      }
      this.setItem(key, array, days);
    }
  }