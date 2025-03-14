import { getMethod, readBody } from 'h3';

// Data mẫu
let examList = [
  {
    id: 1,
    categoryId: 1,
    title: "제2회 양서파충류 자격증 시험",
    completed: 0,
    bookmark: false,
    startDate: "2025-02-01",
    endDate: "2026-02-27",
    duration: 90,
    status: 0,
  },
  {
    id: 2,
    categoryId: 1,
    title: "제2회 양서파충류 자격증 시험",
    completed: 0,
    bookmark: false,
    startDate: "2024-01-05",
    endDate: "2025-03-07",
    duration: 60,
    status: 1,
  },
  {
    id: 3,
    categoryId: 1,
    title: "제2회 양서파충류 자격증 시험",
    bookmark: true,
    startDate: "2025-01-01",
    endDate: "2025-02-25",
    duration: 60,
    status: 0,
  },
  {
    id: 4,
    categoryId: 1,
    title: "제2회 양서파충류 자격증 시험",
    bookmark: false,
    startDate: "2024-01-01",
    endDate: "2025-02-26",
    duration: 120,
    status: 1,
  },
  {
    id: 5,
    categoryId: 1,
    title: "제2회 양서파충류 자격증 시험",
    bookmark: false,
    startDate: "2024-01-01",
    endDate: "2024-10-31",
    duration: 120,
    status: 0,
  },
  {
    id: 6,
    categoryId: 2,
    title: "제1회 사회조사 분석사 모의 자격증 시험",
    bookmark: true,
    startDate: "2025-02-01",
    endDate: "2025-02-25",
    duration: 100,
    status: 0,
  },
  {
    id: 7,
    categoryId: 2,
    title: "제1회 사회조사 분석사 모의 자격증 시험",
    bookmark: false,
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    duration: 60,
    status: 1,
  },
  {
    id: 8,
    categoryId: 2,
    title: "제1회 사회조사 분석사 모의 자격증 시험",
    bookmark: true,
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    duration: 60,
    status: 0,
  },
  {
    id: 9,
    categoryId: 2,
    title: "제1회 사회조사 분석사 모의 자격증 시험",
    bookmark: false,
    startDate: "2025-02-01",
    endDate: "2025-02-27",
    duration: 60,
    status: 0,
  },
  {
    id: 10,
    categoryId: 2,
    title: "제1회 사회조사 분석사 모의 자격증 시험",
    bookmark: false,
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    duration: 60,
    status: 0,
  },
  {
    id: 11,
    categoryId: 2,
    title: "제1회 사회조사 분석사 모의 자격증 시험",
    bookmark: false,
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    duration: 60,
    status: 1,
  },
  {
    id: 12,
    categoryId: 2,
    title: "제1회 사회조사 분석사 모의 자격증 시험",
    bookmark: false,
    startDate: "2023-02-01",
    endDate: "2024-10-28",
    duration: 60,
    status: 1,
  },

];

const getNextId = () => {
  return examList.length ? Math.max(...examList.map(exam => exam.id)) + 1 : 1;
};

export default defineEventHandler(async (event) => {
  const method = getMethod(event); // Get the HTTP method

  // GET: Retrieve exams
  if (method === 'GET') {
    return {
      success: true,
      data: examList,
    };
  }


  const body = await readBody(event); // Read the body for PUT/POST/DELETE



  // PUT: Update an exam by id
  if (method === 'PUT') {
    const { id } = body;
    const examIndex = examList.findIndex((exam) => exam.id === id);

    if (examIndex === -1) {
      return {
        success: false,
        message: 'Exam not found',
      };
    }

    examList[examIndex] = { ...examList[examIndex], ...body };
    return {
      success: true,
      message: 'Exam updated successfully',
      data: examList[examIndex],
    };
  }

  // DELETE: Remove exam by id
  if (method === 'DELETE') {
    const { id } = body;
    const examIndex = examList.findIndex((exam) => exam.id === id);

    if (examIndex === -1) {
      return {
        success: false,
        message: 'Exam not found',
      };
    }

    examList = examList.filter((exam) => exam.id !== id);
    return {
      success: true,
      message: 'Exam deleted successfully',
    };
  }

  if (method === 'PATCH') {
    const { id, bookmark } = await readBody(event);

    const examIndex = examList.findIndex((exam) => exam.id === id);

    if (examIndex === -1) {
      return {
        success: false,
        message: 'Exam not found',
      };
    }

    // Update bookmark
    examList[examIndex].bookmark = bookmark;

    return {
      success: true,
      message: 'Bookmark updated successfully',
      data: examList[examIndex],
    };
  }

  // If the method is not allowed, return a 405 error
  return {
    success: false,
    message: 'Method not allowed',
  };
})
