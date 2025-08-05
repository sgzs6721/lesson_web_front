import { Gender } from '../types/coach';

// 导入本地头像文件
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

// 本地头像数组
const maleAvatars = [male0, male1, male2, male3, male4, male5, male6, male7, male8, male9, male10, male11, male12, male13, male14];
const femaleAvatars = [female0, female1, female2, female3, female4, female5, female6, female7, female8, female9, female10, female11, female12, female13, female14];

// 头像数据组织方式，区分男女
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