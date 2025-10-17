
import axios from '../../api/axios'
export default function RequestBtns({userID, friendID, auth}) {

    async function acceptRequest() {
        const results = await axios.put(`/friend/${userID}/accept`, {friendID}, {
            headers: {
                Authorization: `Bearer ${auth}`}
            
        })
        console.log(results)
        return results
  }

  return (
    <div className='row-end-2 col-start-1'>
        <button onClick={acceptRequest} className='text-sm bg-lime-400 p-1 rounded-full shadow-xl text-stone-200'>Accept</button>
    </div>
  )
}
