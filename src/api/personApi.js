import { getAllResources, getSingleResource } from './baseApi'

export async function getAllPeople(){
    const allPeople = await getAllResources('person')
    return allPeople
}

/**
 * @param {object} personData takes data from person query, all it needs is {id: id}
 * @returns {array} array of votes with the following data:
 * { id, decision, file, event_minutes_item_id, matter, name, created, legistar_event_id, legistar_vote_id, person_id }
 */

export async function getVotesForPerson(personData){
    const formattedVotes = []
    const votes = await getSingleResource('vote', 'person_id', personData.id)
    const allEventMinutesItems = await getAllResources('event_minutes_item')
    const allMinuteItems = await getAllResources('minutes_item')
    const allMinuteFiles = await getAllResources('minutes_item_file')
    votes.forEach((voteData) => {
        const eventMinuteItem = allEventMinutesItems.find(item => item.id === voteData.event_minutes_item_id);
        const minuteItem = allMinuteItems.find(item => item.id === eventMinuteItem.minutes_item_id)
        const file = allMinuteFiles.find(item => item.minutes_item_id === minuteItem.id)
        const formattedVote = {
            ...voteData,
            ...minuteItem,
            file
        }
       formattedVotes.push(formattedVote)
    })
    return formattedVotes
}