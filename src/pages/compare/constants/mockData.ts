import { AllCampusData } from '../types/campus';

// 模拟的校区数据
export const campusData: AllCampusData = {
  headquarters: {
    id: 'headquarters',
    name: '总部校区',
    revenue: 32.05,
    profit: 12.82,
    students: 450,
    coaches: 15,
    growthData: {
      students: [380, 390, 400, 410, 415, 420, 425, 430, 435, 440, 445, 450],
      revenue: [28.5, 29.2, 30.1, 30.8, 31.5, 32.0, 32.5, 33.0, 33.8, 34.5, 35.2, 35.8],
      profit: [11.4, 11.7, 12.0, 12.3, 12.6, 12.8, 13.0, 13.2, 13.5, 13.8, 14.1, 14.3]
    },
    coachPerformance: {
      lessons: 95,
      students: 28,
      salary: 12500
    }
  },
  east: {
    id: 'east',
    name: '东城校区',
    revenue: 27.60,
    profit: 11.04,
    students: 360,
    coaches: 12,
    growthData: {
      students: [300, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360],
      revenue: [23.0, 23.5, 24.2, 24.8, 25.3, 25.9, 26.5, 27.0, 27.5, 28.0, 28.5, 29.0],
      profit: [9.2, 9.4, 9.7, 9.9, 10.1, 10.4, 10.6, 10.8, 11.0, 11.2, 11.4, 11.6]
    },
    coachPerformance: {
      lessons: 88,
      students: 25,
      salary: 11800
    }
  },
  west: {
    id: 'west',
    name: '西城校区',
    revenue: 20.80,
    profit: 8.32,
    students: 275,
    coaches: 8,
    growthData: {
      students: [220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275],
      revenue: [17.5, 18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0, 21.5, 22.0, 22.5, 23.0],
      profit: [7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.2, 8.4, 8.6, 8.8, 9.0, 9.2]
    },
    coachPerformance: {
      lessons: 82,
      students: 22,
      salary: 11200
    }
  },
  south: {
    id: 'south',
    name: '南城校区',
    revenue: 13.20,
    profit: 4.62,
    students: 185,
    coaches: 5,
    growthData: {
      students: [130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185],
      revenue: [10.5, 10.8, 11.2, 11.5, 11.8, 12.2, 12.5, 12.8, 13.2, 13.5, 13.8, 14.0],
      profit: [3.7, 3.8, 3.9, 4.0, 4.1, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9]
    },
    coachPerformance: {
      lessons: 78,
      students: 19,
      salary: 10500
    }
  },
  north: {
    id: 'north',
    name: '北城校区',
    revenue: 7.12,
    profit: 2.49,
    students: 115,
    coaches: 2,
    growthData: {
      students: [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
      revenue: [5.5, 5.8, 6.0, 6.2, 6.5, 6.8, 7.0, 7.2, 7.5, 7.8, 8.0, 8.2],
      profit: [1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0]
    },
    coachPerformance: {
      lessons: 70,
      students: 16,
      salary: 9800
    }
  }
}; 