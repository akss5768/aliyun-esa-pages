// IndexedDB工具类，用于存储冰箱物品和图片
// 包含将文件转换为base64的方法
class DBUtils {
  constructor() {
    this.dbName = 'FridgeDB';
    this.version = 1;
    this.db = null;
  }

  // 将文件转换为base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // 初始化数据库
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('数据库打开失败');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('数据库打开成功');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 如果对象仓库不存在，则创建
        if (!db.objectStoreNames.contains('fridgeItems')) {
          const objectStore = db.createObjectStore('fridgeItems', { keyPath: 'id' });
          objectStore.createIndex('category', 'category', { unique: false });
          objectStore.createIndex('addedDate', 'addedDate', { unique: false });
          objectStore.createIndex('expiryDate', 'expiryDate', { unique: false });
        }
      };
    });
  }

  // 添加或更新物品
  async addItem(item) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['fridgeItems'], 'readwrite');
      const objectStore = transaction.objectStore('fridgeItems');
      const request = objectStore.put(item);

      request.onsuccess = () => {
        console.log('物品添加/更新成功');
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('物品添加/更新失败');
        reject(request.error);
      };
    });
  }

  // 获取所有物品
  async getAllItems() {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['fridgeItems'], 'readonly');
      const objectStore = transaction.objectStore('fridgeItems');
      const request = objectStore.getAll();

      request.onsuccess = () => {
        console.log('获取物品列表成功');
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('获取物品列表失败');
        reject(request.error);
      };
    });
  }

  // 根据ID获取物品
  async getItemById(id) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['fridgeItems'], 'readonly');
      const objectStore = transaction.objectStore('fridgeItems');
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // 删除物品
  async deleteItem(id) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['fridgeItems'], 'readwrite');
      const objectStore = transaction.objectStore('fridgeItems');
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        console.log('物品删除成功');
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('物品删除失败');
        reject(request.error);
      };
    });
  }

  // 清空所有物品
  async clearAllItems() {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['fridgeItems'], 'readwrite');
      const objectStore = transaction.objectStore('fridgeItems');
      const request = objectStore.clear();

      request.onsuccess = () => {
        console.log('清空物品列表成功');
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('清空物品列表失败');
        reject(request.error);
      };
    });
  }
}

// 创建单例实例
const dbInstance = new DBUtils();
export default dbInstance;