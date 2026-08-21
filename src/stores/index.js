import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLibraryStore = defineStore('library', () => {
  // 图书数据
  const books = ref([
    { id: 1, isbn: '978-7-111-40701-0', title: '深入理解计算机系统', author: 'Randal E. Bryant', publisher: '机械工业出版社', category: '计算机', total: 10, available: 7, cover: '', publishDate: '2016-11-01', price: 139.00 },
    { id: 2, isbn: '978-7-115-41730-5', title: 'Vue.js设计与实现', author: '霍春阳', publisher: '人民邮电出版社', category: '计算机', total: 8, available: 5, cover: '', publishDate: '2022-08-01', price: 108.00 },
    { id: 3, isbn: '978-7-115-42802-8', title: 'JavaScript高级程序设计', author: 'Matt Frisbie', publisher: '人民邮电出版社', category: '计算机', total: 12, available: 9, cover: '', publishDate: '2020-09-01', price: 129.00 },
    { id: 4, isbn: '978-7-111-63666-3', title: '算法导论', author: 'Thomas H. Cormen', publisher: '机械工业出版社', category: '计算机', total: 6, available: 4, cover: '', publishDate: '2012-12-01', price: 128.00 },
    { id: 5, isbn: '978-7-5442-9116-3', title: '百年孤独', author: '加西亚·马尔克斯', publisher: '南海出版公司', category: '文学', total: 15, available: 12, cover: '', publishDate: '2017-08-01', price: 55.00 },
    { id: 6, isbn: '978-7-02-002475-7', title: '红楼梦', author: '曹雪芹', publisher: '人民文学出版社', category: '文学', total: 20, available: 18, cover: '', publishDate: '1996-12-01', price: 59.70 },
    { id: 7, isbn: '978-7-108-00982-2', title: '围城', author: '钱锺书', publisher: '生活·读书·新知三联书店', category: '文学', total: 8, available: 6, cover: '', publishDate: '1991-02-01', price: 19.00 },
    { id: 8, isbn: '978-7-208-06164-3', title: '万历十五年', author: '黄仁宇', publisher: '上海三联书店', category: '历史', total: 10, available: 8, cover: '', publishDate: '2006-08-01', price: 18.00 },
  ])

  // 读者数据
  const readers = ref([
    { id: 1, name: '张三', phone: '138****1234', email: 'zhangsan@email.com', type: '普通读者', borrowLimit: 5, currentBorrow: 2, totalBorrow: 15, joinDate: '2023-01-15', status: '正常' },
    { id: 2, name: '李四', phone: '139****5678', email: 'lisi@email.com', type: 'VIP读者', borrowLimit: 10, currentBorrow: 4, totalBorrow: 32, joinDate: '2022-06-20', status: '正常' },
    { id: 3, name: '王五', phone: '137****9012', email: 'wangwu@email.com', type: '学生读者', borrowLimit: 3, currentBorrow: 3, totalBorrow: 8, joinDate: '2024-02-10', status: '正常' },
    { id: 4, name: '赵六', phone: '136****3456', email: 'zhaoliu@email.com', type: '普通读者', borrowLimit: 5, currentBorrow: 0, totalBorrow: 6, joinDate: '2023-08-05', status: '正常' },
    { id: 5, name: '孙七', phone: '135****7890', email: 'sunqi@email.com', type: '教师读者', borrowLimit: 15, currentBorrow: 8, totalBorrow: 45, joinDate: '2021-09-01', status: '正常' },
  ])

  // 借阅记录
  const borrowRecords = ref([
    { id: 1, bookId: 1, bookTitle: '深入理解计算机系统', readerId: 1, readerName: '张三', borrowDate: '2024-01-10', dueDate: '2024-02-10', returnDate: null, status: '借阅中', renewCount: 0 },
    { id: 2, bookId: 2, bookTitle: 'Vue.js设计与实现', readerId: 2, readerName: '李四', borrowDate: '2024-01-08', dueDate: '2024-02-08', returnDate: '2024-01-28', status: '已归还', renewCount: 1 },
    { id: 3, bookId: 5, bookTitle: '百年孤独', readerId: 3, readerName: '王五', borrowDate: '2024-01-05', dueDate: '2024-02-05', returnDate: null, status: '借阅中', renewCount: 0 },
    { id: 4, bookId: 8, bookTitle: '万历十五年', readerId: 5, readerName: '孙七', borrowDate: '2023-12-20', dueDate: '2024-01-20', returnDate: null, status: '逾期', renewCount: 2 },
    { id: 5, bookId: 3, bookTitle: 'JavaScript高级程序设计', readerId: 1, readerName: '张三', borrowDate: '2024-01-12', dueDate: '2024-02-12', returnDate: null, status: '借阅中', renewCount: 0 },
  ])

  // 分类数据
  const categories = ref([
    { id: 1, name: '计算机', count: 45, icon: 'Monitor', color: '#6366f1' },
    { id: 2, name: '文学', count: 38, icon: 'Notebook', color: '#06b6d4' },
    { id: 3, name: '历史', count: 22, icon: 'Clock', color: '#f472b6' },
    { id: 4, name: '科学', count: 18, icon: 'Aim', color: '#10b981' },
    { id: 5, name: '艺术', count: 15, icon: 'Picture', color: '#f59e0b' },
    { id: 6, name: '经济', count: 12, icon: 'TrendCharts', color: '#8b5cf6' },
  ])

  // 统计数据
  const statistics = computed(() => {
    const totalBooks = books.value.reduce((sum, b) => sum + b.total, 0)
    const availableBooks = books.value.reduce((sum, b) => sum + b.available, 0)
    const borrowedBooks = totalBooks - availableBooks
    const totalReaders = readers.value.length
    const activeBorrows = borrowRecords.value.filter(r => r.status === '借阅中').length
    const overdueBorrows = borrowRecords.value.filter(r => r.status === '逾期').length

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalReaders,
      activeBorrows,
      overdueBorrows,
      borrowRate: ((borrowedBooks / totalBooks) * 100).toFixed(1)
    }
  })

  // 操作方法
  const addBook = (book) => {
    books.value.push({ ...book, id: Date.now() })
  }

  const updateBook = (id, data) => {
    const index = books.value.findIndex(b => b.id === id)
    if (index !== -1) {
      books.value[index] = { ...books.value[index], ...data }
    }
  }

  const deleteBook = (id) => {
    books.value = books.value.filter(b => b.id !== id)
  }

  const addReader = (reader) => {
    readers.value.push({ ...reader, id: Date.now() })
  }

  const updateReader = (id, data) => {
    const index = readers.value.findIndex(r => r.id === id)
    if (index !== -1) {
      readers.value[index] = { ...readers.value[index], ...data }
    }
  }

  const deleteReader = (id) => {
    readers.value = readers.value.filter(r => r.id !== id)
  }

  const borrowBook = (bookId, readerId) => {
    const book = books.value.find(b => b.id === bookId)
    const reader = readers.value.find(r => r.id === readerId)
    
    if (book && book.available > 0 && reader) {
      book.available--
      reader.currentBorrow++
      
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 30)
      
      borrowRecords.value.push({
        id: Date.now(),
        bookId,
        bookTitle: book.title,
        readerId,
        readerName: reader.name,
        borrowDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        returnDate: null,
        status: '借阅中',
        renewCount: 0
      })
      return true
    }
    return false
  }

  const returnBook = (recordId) => {
    const record = borrowRecords.value.find(r => r.id === recordId)
    if (record) {
      const book = books.value.find(b => b.id === record.bookId)
      const reader = readers.value.find(r => r.id === record.readerId)
      
      if (book && reader) {
        book.available++
        reader.currentBorrow--
        record.returnDate = new Date().toISOString().split('T')[0]
        record.status = '已归还'
        return true
      }
    }
    return false
  }

  return {
    books,
    readers,
    borrowRecords,
    categories,
    statistics,
    addBook,
    updateBook,
    deleteBook,
    addReader,
    updateReader,
    deleteReader,
    borrowBook,
    returnBook
  }
})
