
export default function UserCard({person}) {

    return person && (
    <div className="flex w-full bg-stone-600">
        <div className="h-full">
            <div className="relative h-32">
                <img src={`http://localhost:9000/profile/defaultMale.png`} className="h-full"/>
            </div>
            <h2>{person.firstName} {person.lastName}</h2>
        </div>
        <div>

        </div>
    </div>
    
  )
}
