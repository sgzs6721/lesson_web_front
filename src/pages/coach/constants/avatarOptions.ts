import { Gender } from '../types/coach';

// 头像数据组织方式，区分男女
export const avatarOptions = {
  MALE: Array(15).fill(null).map((_, index) => ({
    id: `male_avatar_${index + 1}`,
    url: `https://randomuser.me/api/portraits/men/${index}.jpg`
  })),
  FEMALE: Array(15).fill(null).map((_, index) => ({
    id: `female_avatar_${index + 1}`,
    url: `https://randomuser.me/api/portraits/women/${index}.jpg`
  })),
  // 为了向后兼容而增加的
  male: Array(15).fill(null).map((_, index) => ({
    id: `male_avatar_${index + 1}`,
    url: `https://randomuser.me/api/portraits/men/${index}.jpg`
  })),
  female: Array(15).fill(null).map((_, index) => ({
    id: `female_avatar_${index + 1}`,
    url: `https://randomuser.me/api/portraits/women/${index}.jpg`
  }))
}; 