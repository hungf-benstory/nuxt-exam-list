// Data test
let categoryExam = [
  {
    id: 1,
    category: "양서파충류",
  },
  {
    id: 2,
    category: "사회조사분석사 2급",
  },
];
export default defineEventHandler(async (event) => {
  const { method } = event.req;

  // GET: Get exams
  if (method === 'GET') {
    return {
      success: true,
      data: categoryExam,
    };
  }
  return {
    success: false,
    message: 'Method not allowed',
  };
});
