import React from 'react'
import { Plus, CircleCheckBig } from 'lucide-react'
function QuestionManagement() {
  return (
    <>
      <div className='pl-10 shadow-2xl border-2 border-gray-100 rounded-3xl p-4 w-4/6 mx-auto bg-gray-50'>
        <div className='flex p-4 items-center gap-4'>
          <Plus strokeWidth={1.5} className='bg-custom-blue h-12 w-12 rounded-xl text-white' />
          <div>
            <h1 className='text-2xl font-bold'>Create new Question</h1>
            <p className='font-light '>Add questions for students to practice</p>
          </div>

        </div>
        <form action="">
          <div className='grid grid-cols-2 gap-0 mb-6'>
            <div>
              <label htmlFor="title" className='block mb-2 '>Question title</label>
              <input
                type="text"
                name='title'
                placeholder='Enter Question title'
                className='border border-gray-300 rounded-3xl py-2 px-4 w-2/3'
              />
            </div>
            <div>
              <label htmlFor="category" className='block mb-2'>Category</label>
              <input
                type="text"
                name='category'
                placeholder='Category'
                className=' border border-gray-300 rounded-3xl py-2 px-4 w-2/3'
              />
            </div>
          </div>
          <label
            htmlFor="difficulty"
            className='block'
          >Difficulty</label>
          <select
            name="difficulty"
            id="difficulty"
            className='w-full border border-gray-300 rounded-3xl py-3 px-4 mb-6'>
            <option value="default">Pick a difficulty level</option>
            <option value="hard">Hard</option>
            <option value="medium">Medium</option>
            <option value="easy">Easy</option>
          </select>

          <label
            htmlFor="description"
          >Question Description</label>
          <textarea
            name="description"
            id="description"
            className='w-full border border-gray-300 rounded-3xl h-42 py-3 px-4'
            placeholder='Enter the full question description'></textarea>
          <div className='flex justify-between items-center'>
            <label htmlFor="answers" >Answers</label>
            <button className='bg-custom-orange text-white py-2 px-4 rounded-3xl'>Add an answer slot</button>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center border border-gray-300 rounded-3xl px-4 py-2 w-2/3'>
              <CircleCheckBig className='text-custom-orange mr-4' />
              <input
                type="text"
                placeholder='answer option 1'
                className='w-full'
              />
            </div>


            <div className='flex items-center border border-gray-300 rounded-3xl px-4 py-2 w-2/3'>
              <CircleCheckBig className='text-custom-orange mr-4' />
              <input
                type="text"
                placeholder='answer option 2'
                className='w-full '
              />
            </div>

          </div>
        </form>
      </div>
    </>
  )
}

export default QuestionManagement
