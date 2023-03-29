import { ref, Ref } from 'vue'
import { User, Category, Views, Collections } from '@/types'
import { useRouter } from 'vue-router'
import { db } from '@/firebase'
import { collection, addDoc, doc, getDoc, getDocs } from 'firebase/firestore'

interface UseApiClient {
  user: Ref<User | null>
  category: Ref<Category | null>
  categories: Ref<string[] | null>
  createUser: (user: string) => void
  getUser: () => Promise<User | null>
  getCategory: (id: string) => Promise<Category | null>
  getAllCategoriesIds: () => Promise<string[] | null>
}

export const useApiClient = (): UseApiClient => {
  const user = ref<User | null>(null)
  const category = ref<Category | null>(null)
  const categories = ref<string[] | null>([])
  const router = useRouter()

  const createUser = (username: string): void => {
    addDoc(collection(db, Collections.USER), {
      username,
    })
    router.push({
      name: Views.SELECT_GAME,
    })
  }

  const getUser = async (): Promise<User | null> => {
    const docRef = doc(db, Collections.USER, 'ZT3M02YeS43ha9ZXhCc2')
    const docSnapshot = await getDoc(docRef)
    user.value = docSnapshot.data() as User
    console.log(user.value)
    return user.value
  }

  const getCategory = async (id: string): Promise<Category | null> => {
    const docRef = doc(db, Collections.CARD, id)
    const docSnapshot = await getDoc(docRef)
    category.value = docSnapshot.data() as Category
    return category.value
  }

  const getAllCategoriesIds = async (): Promise<string[] | null> => {
    const querySnapshot = await getDocs(collection(db, Collections.CARD))
    querySnapshot.forEach((doc) => {
      const data = doc.id
      categories.value?.push(data)
    })
    return categories.value
  }

  return {
    user,
    category,
    categories,
    createUser,
    getUser,
    getCategory,
    getAllCategoriesIds
  }
}
