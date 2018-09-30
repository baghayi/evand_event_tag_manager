import { searchingEventById } from './searchingEventById.js';
import { EventFinder } from '../services/EventFinder.js';
import { EventStatistics } from '../services/EventStatistics.js';
import { Main } from '../services/Main.js';
import * as Questions from './AnswerQuestion/Questions.js';

const main = new Main();
main.run(run);

function eventSlug(tabUrl) {
    let pieces = tabUrl.pathname.split("/");
    if(pieces.length >= 3 && pieces[1] === 'events') {
        return pieces[2];
    }

    return null;
}

function updateQuestionAnswers(answers){
    let questionAnswers = document.getElementById('question-answers');
    document.querySelector('#question-answers > .loading-message').style = "display: none;";

    questionAnswers.innerHTML = questionAnswers.innerHTML + answers;
}

function run (jwt, tabUrl) {

    const eventSlugValue = eventSlug(tabUrl);
    if(null === eventSlugValue) {
        document.querySelector('#question-answers > .loading-message').style = "display: none;";
    }else {
        (new EventFinder(jwt)).bySlug(eventSlugValue, function(event){
            let questions = new Questions.Event();
            updateQuestionAnswers(questions.answer(event));
        });

        (new EventStatistics(jwt)).bySlug(eventSlugValue, function(data){
            let questions = new Questions.EventStatistics();
            updateQuestionAnswers(questions.answer(data));
        });
    }


    searchingEventById();

}


