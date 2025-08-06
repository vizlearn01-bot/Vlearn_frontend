import { useState } from 'react'
import { Plus, CircleCheckBig, Trash2 } from 'lucide-react'

function QuestionManagement() {

  const [answerFields, setAnswerFields] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ])

  function addAnswerField() {
    setAnswerFields([...answerFields, { text: '', isCorrect: false }]);
  }
  function removefield(index) {
    let data = [...answerFields];
    data.splice(index, 1)
    setAnswerFields(data)
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="shadow-2xl border-2 border-gray-100 rounded-3xl p-6 md:p-8 w-full max-w-5xl mx-auto bg-gray-50">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <Plus strokeWidth={1.5} className="bg-custom-blue h-12 w-12 rounded-xl text-white" />
          <div>
            <h1 className="text-2xl font-bold">Create new Question</h1>
            <p className="font-light">Add questions for students to practice</p>
          </div>
        </div>
        <form action="">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="title" className="block mb-2">Related question group </label>
              <select name="quiz-group" id="quiz-group"
                className='border border-gray-300 rounded-3xl py-2 px-4 w-full placeholder:text-sm placeholder:font-extralight placeholder:text-gray-400'>
                <option value="default">Pick a related question group</option>
                <option value="ammonia gas">Preparation of ammonia gas</option>
                <option value="nitrogen">Preparation of nitrogen in a lab</option>
                <option value="titration">Titration</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block mb-2">Category</label>
              <input
                type="text"
                name="category"
                placeholder="Category"
                className="border border-gray-300 rounded-3xl py-2 px-4 w-full placeholder:text-sm placeholder:font-extralight placeholder:text-gray-400"
              />
            </div>
            <div>
              <label htmlFor="points" className="block mb-2">Points</label>
              <input
                type="number"
                name="points"
                placeholder="Points"
                className="border border-gray-300 rounded-3xl py-2 px-4 w-full placeholder:text-sm placeholder:font-extralight placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="text" className="block mb-2">Question text</label>
            <textarea
              name="text"
              id="text"
              className="w-full border border-gray-300 rounded-3xl h-42 py-3 px-4 placeholder:text-sm placeholder:font-extralight placeholder:text-gray-400"
              placeholder="Enter the full question text"
            ></textarea>
          </div>

          {/* Answers Header */}
          <div className="flex justify-between items-center mt-4 mb-4">
            <label htmlFor="answers" className="text-base font-medium">Answers</label>
            <button
              type="button"
              className="bg-custom-orange text-white py-2 px-4 rounded-3xl text-sm"
              onClick={addAnswerField}>
              Add an answer slot
            </button>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-4">
            {answerFields.map((answerField, index) => (
              <div
                key={index}
                className="flex items-center border border-gray-300 rounded-3xl px-4 py-2 w-full md:w-2/3"
              >
                <CircleCheckBig className="text-custom-orange mr-4" />
                <input
                  type="text"
                  placeholder={`Answer option ${index + 1}`}
                  className="w-full placeholder:text-sm placeholder:font-extralight placeholder:text-gray-400"
                />
                <Trash2
                  onClick={() => removefield(index)}
                  className='text-custom-blue hover:cursor-pointer hover:text-custom-orange' />
              </div>
            ))}
          </div>
          <button className='flex justify-center mx-auto bg-custom-blue text-white py-2 px-4 rounded-3xl shadow-2xl hover:cursor-pointer hover:bg-custom-orange'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default QuestionManagement
