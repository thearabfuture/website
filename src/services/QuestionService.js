import firebase from "./FirebaseService";
import UserService from "./UserService";

class QuestionService {

	async fetchQuestions() {

		const userService = new UserService();

		try {

			let questions = [];
			
			const questionData = await firebase.firestore().collection("questions").orderBy("date", "desc").get();

			for (const question of questionData.docs) {

				try {

					const author = await userService.fetchUser(question.get("author"));

					questions.push({
						id: question.id,
						title: question.get("title"),
						content: question.get("content"),
						category: question.get("category"),
						date: question.get("date").toDate(),
						userData: author
					});
				}
				catch(error) {
					questions.push({
						id: question.id,
						title: question.get("title"),
						content: question.get("content"),
						category: question.get("category"),
						date: question.get("date").toDate(),
						userData: {
							id: "unknown",
							username: "Unknown"
						}
					});
				}

			}

			return questions;
		}	
		catch(error) {
			throw error;
		}
	}

	async fetchQuestionsByUser(uid) {

		const userService = new UserService();

		try {

			let questions = [];
			
			const questionData = await firebase.firestore().collection("questions").where("author", "==", uid).get();

			for (const question of questionData.docs) {

				let answers = [];

				const answerResult = await firebase.firestore().collection("questions").doc(question.id).collection("answers").orderBy("date", "asc").get();
				
				for (const answer of answerResult.docs) {
					
					const author = await userService.fetchUser(answer.get("author"));

					answers.push({
						id: answer.id,
						content: answer.get("content"),
						date: answer.get("date").toDate(),
						userData: author
					});
					
				}
				
				const author = await userService.fetchUser(question.get("author"));
				
				questions.push({
					id: question.id,
					title: question.get("title"),
					content: question.get("content"),
					category: question.get("category"),
					date: question.get("date").toDate(),
					answers: answers,
					userData: author
				});

			}

			return questions;
		}	
		catch(error) {
			throw error;
		}
		
	}


	async getQuestion(id) {

		const userService = new UserService();

		try {
			
			const question = await firebase.firestore().collection("questions").doc(id).get();

			if(question.exists) {

				let answers = [];

				const answerResult = await firebase.firestore().collection("questions").doc(id).collection("answers").orderBy("date", "asc").get();
				
				for (const answer of answerResult.docs) {
					
					const author = await userService.fetchUser(answer.get("author"));

					answers.push({
						id: answer.id,
						content: answer.get("content"),
						date: answer.get("date").toDate(),
						userData: author
					});
					
				}
				const author = await userService.fetchUser(question.get("author"));

				return {
					id: question.id,
					title: question.get("title"),
					content: question.get("content"),
					category: question.get("category"),
					date: question.get("date").toDate(),
					answers: answers,
					userData: author
				};
			}
			else {
				const error = new Error();
				error.code = "question/question-not-found";

				throw error;
			}
		}	
		catch(error) {
			throw error;
		}
	}

	async addQuestion(uid, title, category, content) {

		try {
			await firebase.firestore().collection("questions").add({
				author: uid,
				title: title,
				category: category,
				content: content,
				date: firebase.firestore.FieldValue.serverTimestamp()
			});
		}
		catch(error) {
			throw error;
		}
	}

	async addAnswer(id, uid, content) {
		try {
			await firebase.firestore().collection("questions").doc(id).collection("answers").add({
				author: uid,
				content: content,
				date: firebase.firestore.FieldValue.serverTimestamp()
			})
		}
		catch(error) {
			throw error;
		}
	}

}

export default QuestionService;
