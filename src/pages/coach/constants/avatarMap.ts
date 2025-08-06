// 头像静态资源映射表（自动生成）
import male0 from '../../../assets/images/avatars/male/male_0.jpg';
import male1 from '../../../assets/images/avatars/male/male_1.jpg';
import male2 from '../../../assets/images/avatars/male/male_2.jpg';
import male3 from '../../../assets/images/avatars/male/male_3.jpg';
import male4 from '../../../assets/images/avatars/male/male_4.jpg';
import male5 from '../../../assets/images/avatars/male/male_5.jpg';
import male6 from '../../../assets/images/avatars/male/male_6.jpg';
import male7 from '../../../assets/images/avatars/male/male_7.jpg';
import male8 from '../../../assets/images/avatars/male/male_8.jpg';
import male9 from '../../../assets/images/avatars/male/male_9.jpg';
import male10 from '../../../assets/images/avatars/male/male_10.jpg';
import male11 from '../../../assets/images/avatars/male/male_11.jpg';
import male12 from '../../../assets/images/avatars/male/male_12.jpg';
import male13 from '../../../assets/images/avatars/male/male_13.jpg';
import male14 from '../../../assets/images/avatars/male/male_14.jpg';
import female0 from '../../../assets/images/avatars/female/female_0.jpg';
import female1 from '../../../assets/images/avatars/female/female_1.jpg';
import female2 from '../../../assets/images/avatars/female/female_2.jpg';
import female3 from '../../../assets/images/avatars/female/female_3.jpg';
import female4 from '../../../assets/images/avatars/female/female_4.jpg';
import female5 from '../../../assets/images/avatars/female/female_5.jpg';
import female6 from '../../../assets/images/avatars/female/female_6.jpg';
import female7 from '../../../assets/images/avatars/female/female_7.jpg';
import female8 from '../../../assets/images/avatars/female/female_8.jpg';
import female9 from '../../../assets/images/avatars/female/female_9.jpg';
import female10 from '../../../assets/images/avatars/female/female_10.jpg';
import female11 from '../../../assets/images/avatars/female/female_11.jpg';
import female12 from '../../../assets/images/avatars/female/female_12.jpg';
import female13 from '../../../assets/images/avatars/female/female_13.jpg';
import female14 from '../../../assets/images/avatars/female/female_14.jpg';

export const avatarMap: Record<string, string> = {
  'male_0.jpg': male0,
  'male_1.jpg': male1,
  'male_2.jpg': male2,
  'male_3.jpg': male3,
  'male_4.jpg': male4,
  'male_5.jpg': male5,
  'male_6.jpg': male6,
  'male_7.jpg': male7,
  'male_8.jpg': male8,
  'male_9.jpg': male9,
  'male_10.jpg': male10,
  'male_11.jpg': male11,
  'male_12.jpg': male12,
  'male_13.jpg': male13,
  'male_14.jpg': male14,
  'female_0.jpg': female0,
  'female_1.jpg': female1,
  'female_2.jpg': female2,
  'female_3.jpg': female3,
  'female_4.jpg': female4,
  'female_5.jpg': female5,
  'female_6.jpg': female6,
  'female_7.jpg': female7,
  'female_8.jpg': female8,
  'female_9.jpg': female9,
  'female_10.jpg': female10,
  'female_11.jpg': female11,
  'female_12.jpg': female12,
  'female_13.jpg': female13,
  'female_14.jpg': female14,
};

// 反向映射：从import的URL找回对应的文件名
export const reverseAvatarMap: Record<string, string> = {
  [male0]: 'male_0.jpg',
  [male1]: 'male_1.jpg',
  [male2]: 'male_2.jpg',
  [male3]: 'male_3.jpg',
  [male4]: 'male_4.jpg',
  [male5]: 'male_5.jpg',
  [male6]: 'male_6.jpg',
  [male7]: 'male_7.jpg',
  [male8]: 'male_8.jpg',
  [male9]: 'male_9.jpg',
  [male10]: 'male_10.jpg',
  [male11]: 'male_11.jpg',
  [male12]: 'male_12.jpg',
  [male13]: 'male_13.jpg',
  [male14]: 'male_14.jpg',
  [female0]: 'female_0.jpg',
  [female1]: 'female_1.jpg',
  [female2]: 'female_2.jpg',
  [female3]: 'female_3.jpg',
  [female4]: 'female_4.jpg',
  [female5]: 'female_5.jpg',
  [female6]: 'female_6.jpg',
  [female7]: 'female_7.jpg',
  [female8]: 'female_8.jpg',
  [female9]: 'female_9.jpg',
  [female10]: 'female_10.jpg',
  [female11]: 'female_11.jpg',
  [female12]: 'female_12.jpg',
  [female13]: 'female_13.jpg',
  [female14]: 'female_14.jpg',
};

// 数组形式的头像选项，用于CoachEditModal
const maleAvatars = [male0, male1, male2, male3, male4, male5, male6, male7, male8, male9, male10, male11, male12, male13, male14];
const femaleAvatars = [female0, female1, female2, female3, female4, female5, female6, female7, female8, female9, female10, female11, female12, female13, female14];

export const avatarOptions = {
  MALE: maleAvatars.map((avatar, index) => ({
    id: `male_avatar_${index + 1}`,
    url: avatar
  })),
  FEMALE: femaleAvatars.map((avatar, index) => ({
    id: `female_avatar_${index + 1}`,
    url: avatar
  })),
  // 为了向后兼容而增加的
  male: maleAvatars.map((avatar, index) => ({
    id: `male_avatar_${index + 1}`,
    url: avatar
  })),
  female: femaleAvatars.map((avatar, index) => ({
    id: `female_avatar_${index + 1}`,
    url: avatar
  }))
};