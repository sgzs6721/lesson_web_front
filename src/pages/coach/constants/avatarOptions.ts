import { Gender } from '../types/coach';

// 头像数据组织方式，区分男女
export const avatarOptions: Record<Gender, Array<{id: string, url: string}>> = {
  male: Array(15).fill(null).map((_, index) => ({
    id: `male_avatar_${index + 1}`,
    url: `https://randomuser.me/api/portraits/men/${index}.jpg`
  })),
  female: Array(15).fill(null).map((_, index) => ({
    id: `female_avatar_${index + 1}`,
    url: `https://randomuser.me/api/portraits/women/${index}.jpg`
  }))
}; 