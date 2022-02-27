import { utilService } from '../../../services/utilService.js';
import { storageService } from '../../../services/storageService.js';

export const emailService = {
	query,
	changeReadUnread,
	removeEmail,
	sortBy,
	filterEmails,
	markRead,
	getEmailById,
	addReply,
	sendMail
};

const KEY = 'emailsDB';
const MY_MAIL = 'gil@gmail.com';
let gMails;
let gFilteredEmails = [];
let gFilterBy = 'all';
let gStarredEmails = [];
let gSentEmails = [];
let gDraftEmails = [];
_createMails();
_createCategories();

function _createMails() {
	gMails = storageService.loadFromStorage(KEY);
	if (!gMails || !gMails.length) {
		gMails = _getDemoMails();
		_saveMailsToStorage();
		return gMails;
	}
}

function _createCategories() {
	gStarredEmails = gMails.filter((mail) => mail.isStarred === true);
	gSentEmails = gMails.filter((mail) => mail.from === MY_MAIL);
	gDraftEmails = gMails.filter((mail) => mail.isDraft);
}

function query(emailsToShow) {
	let mails;
	switch (emailsToShow) {
		case 'starred':
			mails = gStarredEmails;
			break;
		case 'sent':
			mails = gSentEmails;
			break;
		case 'drafts':
			mails = gDraftEmails;
			break;
		default:
			return gMails;
	}
	return mails;
}

function changeReadUnread(emailId) {
	const emailIdx = gMails.findIndex((mail) => mail.id === emailId);
	gMails[emailIdx].isRead = !gMails[emailIdx].isRead;
	_saveMailsToStorage();
}

function markRead(emailId) {
	const emailIdx = gMails.findIndex((mail) => mail.id === emailId);
	if (!emailIdx || emailIdx < 0) return;
	gMails[emailIdx].isRead = true;
	_saveMailsToStorage();
}

function sortBy(sortByValue) {
	let mails;
	if (gFilterBy === 'all') mails = gMails;
	else mails = gFilteredEmails;

	let sortedEmails;
	if (sortByValue.includes('from')) {
		if (sortByValue === 'from-asc') {
			sortedEmails = mails.sort((email1, email2) => {
				if (email1.from > email2.from) return 1;
				if (email2.from > email1.from) return -1;
				else return 0;
			});
		} else {
			sortedEmails = mails.sort((email1, email2) => {
				if (email1.from > email2.from) return -1;
				if (email2.from > email1.from) return 1;
				else return 0;
			});
		}
	}
	if (sortByValue.includes('date')) {
		if (sortByValue === 'date-asc') {
			sortedEmails = mails.sort((email1, email2) => {
				return email1.sentAt - email2.sentAt;
			});
		} else {
			sortedEmails = mails.sort((email1, email2) => {
				return email2.sentAt - email1.sentAt;
			});
		}
	}
	return Promise.resolve(sortedEmails);
}

function getEmailById(emailId) {
	return gMails.find((mail) => mail.id === emailId);
}

function addReply(body, emailId) {
	const emailIdx = gMails.findIndex((mail) => mail.id === emailId);
	gMails[emailIdx].body = body;
	_saveMailsToStorage();
}

function removeEmail(mailId) {
	gMails = gMails.filter((mail) => mail.id !== mailId);
	_saveMailsToStorage();
	return Promise.resolve(gMails);
}

function filterEmails(searchTerm) {
	if (searchTerm.identifier === 'filterBy') {
		const filterByOpt = searchTerm.filterBy;
		if (filterByOpt === 'all') {
			gFilterBy = 'all';
			return gMails;
		}
		gFilteredEmails = gMails.filter((email) => {
			if (filterByOpt === 'unRead') {
				gFilterBy = 'unRead';
				return email.isRead === false;
			} else {
				gFilterBy = 'isRead';
				return email.isRead;
			}
		});
	} else {
		gFilteredEmails = gMails.filter((email) => {
			return Object.values(email)
				.join(' ')
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
		});
		// const filterRegex = new RegExp(searchTerm,'i')
		// gFilteredEmails = gMails.filter((email) => {
		// 	return filterRegex.test(email.from) || filterRegex.test(email.subject)||filterRegex.test(email.body)
		// });
	}
	return gFilteredEmails;
}

function _saveMailsToStorage() {
	storageService.saveToStorage(KEY, gMails);
}

function sendMail(emailObj, isDraft) {
	const email = {
		...emailObj,
		from: MY_MAIL,
		id: utilService.makeId(),
		isRead: false,
		isStarred: false,
		isDraft: isDraft,
		sentAt: Date.now()
	};
	gMails = [email, ...gMails];
	_saveMailsToStorage();
	// return email
}

function _getDemoMails() {
	const emails = [
		{
			from: 'Ani',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'Ani Sone DarDasim!?',
			body: 'La la lala lala, sing a happy song La la lala lala, this is so wrong Oh, Im Papa Smurf. Im the head of a small group of blue people, and live in the forest with 99 sons and one daughter! Nothing weird about that no no totally normal!" "And Im Smurfette! And I think Im so pretty! And I betrayed Gargamel, and I dont',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1051133930594
		},
		{
			from: MY_MAIL,
			to: 'Bar',
			id: utilService.makeId(),
			subject: 'Come Back And Grow Your Instagram account?',
			body: 'Hi There, Thanks for your recent visit to Mr. Insta. We are the Internets leading provider of quality Instagram marketing services, and our results will start appearing in',
			isRead: true,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930595
		},
		{
			from: 'Gil',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'Meow?',
			body: 'Top Cat The most effectual Top Cat! Who’s intellectual close friends get to call him T.C., providing it’s with dignity. Top Cat! The indisputable leader of the gang. He’s the boss, he’s a pip, he’s the championship. He’s the most tip top, Top Cat.',
			isRead: false,
			isStarred: false,
			isDraft: true,
			sentAt: 2551155530596
		},
		{
			from: MY_MAIL,
			to: 'Yahel',
			id: utilService.makeId(),
			subject: 'I WILL KILL YOU TAL !!!!!!!!!!',
			body: 'tal Im gonna find you and then Im gonna kill you!',
			isRead: true,
			isStarred: true,
			isDraft: false,
			sentAt: 3551137770597
		},
		{
			from: 'Rami',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'Hey Shmuel',
			body: 'Hey shmuel73 A personal access token (git: https://github.com/ on DESKTOP-NMB15QA at 03-Dec-2019 10:32) with gist and repo scopes was recently added to your account. Visit https://github.com/settings/tokens for more information.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 9551133330597
		},
		{
			from: MY_MAIL,
			to: 'Hai',
			id: utilService.makeId(),
			subject: 'I am your fathe!',
			body: 'Thanks for taking the time to check out Discord! The best relationships in our lives were built around playing games. Memories of staying up late playing Warcraft 3 with friends or sharing creations in The Sims mean so much to us. Discords free voice and text chat is about making it easier for you to spend time with the people you care about, create these memories, and land a headshot or two..',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 2254563930597
		},
		{
			from: 'Debbi',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject:
				'When you want to succeed as bad as you want to breathe, then you’ll be successful.',
			body: 'Scissors cuts paper, paper covers rock, rock crushes lizard, lizard poisons Spock, Spock smashes scissors, scissors decapitates lizard, lizard eats paper, paper disproves Spock, Spock vaporizes rock, and as it always has, rock crushes scissors.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 3251134560597
		},
		{
			from: MY_MAIL,
			to: 'Olivier',
			id: utilService.makeId(),
			subject: 'Bazinga!',
			body: 'There’s no talent here, this is hard work. This is an obsession. Talent does not exist, we are all human beings. You could be anyone if you put in the time. You will reach the top, and that’s that. I am not talented, I am obsessed',
			isRead: false,
			isStarred: true,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: 'Richard',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'Pik Pikachu',
			body: 'Pain is temporary. It may last for a minute, or an hour or a day, or even a year. But eventually, it will subside. And something else takes its place. If I quit, however, it will last forever.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: MY_MAIL,
			to: 'Reynold',
			id: utilService.makeId(),
			subject: 'fuuuuk yo Mon',
			body: 'Listen, Morty, I hate to break it to you, but what people call “love” is just a chemical reaction that compels animals to breed. It hits hard, Morty, then it slowly fades, leaving you stranded in a failing marriage',
			isRead: false,
			isDraft: false,
			isStarred: false,
			sentAt: 1551133930597
		},
		{
			from: 'Bobi',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'I LOVE APPLES :O',
			body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi iure ad magni ratione consequatur explicabo enim. Eos, aperiam mollitia. Perferendis enim similique inventore quidem earum provident laboriosam minus, molestiae atque.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: MY_MAIL,
			to: 'Dudi',
			id: utilService.makeId(),
			subject: 'I DONT GIVE A F***!!!!',
			body: 'Thank you for choosing Bitdefender! Lets take a moment to set up Bitdefender Antivirus Plus 2020 on your devices. First, click on the Activate Subscription button below to link it to your Bitdefender Central account. In case you dont have an account, please create one here. Protect your devices with one account Bitdefender Central lets you remotely manage, secure, and optimize your Bitdefender-protected devices. You can use a single account to manage your subscription for one or more devices. You can manage your security from your mobile device. Anytime. Anywhere. Bitdefender Central is a companion app that empowers you to remotely manage security on your Bitdefender-protected devices directly from your smartphone. If you have any questions, you will most likely find your answers here, or you can contact our support team 24/7. Its great having you on board!The Bitdefender Team',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: 'Tami',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'lorem ipsum dolor sit amet',
			body: 'You can accept or decline this invitation. You can also head over to https://github.com/Talmashiah/Appsus to check out the repository or visit @Talmashiah to learn a bit more about them Note: This invitation was intended for shmuel7e@gmail.com. If you were not expecting this invitation, you can ignore this email. If @Talmashiah is sending you too many emails, you can block them or report abuse..',
			isRead: false,
			isStarred: true,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: MY_MAIL,
			to: 'Igal',
			id: utilService.makeId(),
			subject: 'What a douchbag',
			body: 'Specific pricing and discounts may be subject to change. Please check the Steam store page for details. You are receiving this email because the above items are on your Steam Wishlist',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: 'Chen',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'New login to Instagram from Chrome on Windows',
			body: 'Ulysses, Ulysses — Soaring through all the galaxies. In search of Earth, flying in to the night. Ulysses, Ulysses — Fighting evil and tyranny, with all his power, and with all of his might. Ulysses — no-one else can do the things you do. Ulysses — like a bolt of thunder from the blue. Ulysses — always fighting all the evil forces bringing peace and justice to all. Hong Kong Phooey, number one super guy. Hong Kong Phooey, quicker than the human eye. He’s got style, a groovy style, and a car that just won’',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: MY_MAIL,
			to: 'Herold',
			id: utilService.makeId(),
			subject: 'Bitdefender Antivirus Plus 2020',
			body: 'How have you been enjoying your recent purchase? When you’ve got a few minutes to spare, how about writing a review? Your experience can be a big help to other customers.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: 'Tom',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'on boots, my boss, and sending emails',
			body: 'Hi, Thank you for being part of the HackerRank community of over 7 million developers! We just launched our 3rd annual survey on the state of developer skills and we’d love your input. What’s the best place for developers to learn new skills and what new skills are they learning? What are the most in demand skills that employers are looking for in 2020? These are the questions we’re trying to answer to share with our community.',
			isRead: false,
			isStarred: true,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: 'Rick',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'Talmashiah invited you to TalmashiahAppsus',
			body: 'Thundercats are on the move, Thundercats are loose. Feel the magic, hear the roar, Thundercats are loose. Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats! Thundercats!  I never spend much time in school but I taught ladies plenty. It’s true I hire my body out for pay, hey hey. I’ve gotten burned over Cheryl Tiegs, blown up for Raquel Welch. But when I end up in the hay it’s only hay, hey hey. I might jump an open drawbridge, or Tarzan from a vine. ’Cause I’m the unknown stuntman that makes Eastwood look so fine.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: MY_MAIL,
			to: 'Yuval',
			id: utilService.makeId(),
			subject: '12 items from your Steam wishlist are on sale',
			body: 'Only once in your life, I truly believe, you find someone who can completely turn your world around. You tell them things that you’ve never shared with another soul and they absorb everything you say and actually want to hear more. You share hopes for the future, dreams that will never come true, goals that were never achieved and the many disappointments life has thrown at you. When something wonderful happens, you can’t wait to tell them about it, knowing they will share in your excitement. They are not embarrassed to cry with you when you are hurting or laugh with you when you make a fool of yourself. Never do they hurt your feelings or make you feel like you are not good enough, but rather they build you up and show you the things about yourself that make you special and even beautiful. There is never any pressure, jealousy or competition but only a quiet calmness when they are around. You can be yourself and not worry about what they will think of you because they love you for who you are. The things that seem insignificant to most people such as a note, song or walk become invaluable treasures kept safe in your heart to cherish forever. Memories of your childhood come back and are so clear and vivid it’s like being young again. Colours seem brighter and more brilliant. Laughter seems part of daily life where before it was infrequent or didn’t exist at all. A phone call or two during the day helps to get you through a long day’s work and always brings a smile to your face. In their presence, there’s no need for continuous conversation, but you find you’re quite content in just having them nearby. Things that never interested you before become fascinating because you know they are important to this person who is so special to you. You think of this person on every occasion and in everything you do. Simple things bring them to mind like a pale blue sky, gentle wind or even a storm cloud on the horizon. You open your heart knowing that there’s a chance it may be broken one day and in opening your heart, you experience a love and joy that you never dreamed possible. You find that being vulnerable is the only way to allow your heart to feel true pleasure that’s so real it scares you. You find strength in knowing you have a true friend and possibly a soul mate who will remain loyal to the end. Life seems completely different, exciting and worthwhile. Your only hope and security is in knowing that they are a part of your life.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: 'Yoav',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'Hi Shmuel!',
			body: 'Hello shmuel, We’re so glad to have you! My name is Zuzana, and over the next few days, I will be helping you to get started faster. With the Starter plan, you can collaborate with as many people as you like on up to 3 design projects.For the next 14 days of free trial, you have a chance to see for yourself how Avocode will help you and your team optimise design coding and handoff.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: MY_MAIL,
			to: 'Ruti',
			id: utilService.makeId(),
			subject: 'Soaring through all the galaxies',
			body: 'Linux at SolarEdge Technologies and 9 other jobs for you LinkedIn Ireland Unlimited Company, Wilton Plaza, Wilton Place, Dublin 2. LinkedIn is a registered business name of LinkedIn Ireland Unlimited Company. LinkedIn and the LinkedIn logo are registered trademarks of LinkedIn.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: 'Rotchild',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'Product Review for Order #410107347-0',
			body: 'Hello shmuel, We’re so glad to have you! My name is Zuzana, and over the next few days, I will be helping you to get started faster. With the Starter plan, you can collaborate with as many people as you like on up to 3 design projects.For the next 14 days of free trial, you have a chance to see for yourself how Avocode will help you and your team optimise design coding and handoff.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: 'Thebocher',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject:
				'Reminder: You’re invited to be part of the 2019 State of the Developer Survey',
			body: 'Pick up4!',
			isRead: false,
			isStarred: true,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: MY_MAIL,
			to: 'Alon',
			id: utilService.makeId(),
			subject: 'Thundercats are loose',
			body: 'Hello shmuel, We’re so glad to have you! My name is Zuzana, and over the next few days, I will be helping you to get started faster. With the Starter plan, you can collaborate with as many people as you like on up to 3 design projects.For the next 14 days of free trial, you have a chance to see for yourself how Avocode will help you and your team optimise design coding and handoff.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: MY_MAIL,
			to: 'Jon',
			id: utilService.makeId(),
			subject: 'get up stand up',
			body: 'Hello shmuel, We’re so glad to have you! My name is Zuzana, and over the next few days, I will be helping you to get started faster. With the Starter plan, you can collaborate with as many people as you like on up to 3 design projects.For the next 14 days of free trial, you have a chance to see for yourself how Avocode will help you and your team optimise design coding and handoff.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: 'Bon',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'Zuzana from Avocode',
			body: 'Hello shmuel, We’re so glad to have you! My name is Zuzana, and over the next few days, I will be helping you to get started faster. With the Starter plan, you can collaborate with as many people as you like on up to 3 design projects.For the next 14 days of free trial, you have a chance to see for yourself how Avocode will help you and your team optimise design coding and handoff.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: MY_MAIL,
			to: 'Zehava',
			id: utilService.makeId(),
			subject: 'SW Application Engineer',
			body: 'Hello shmuel, We’re so glad to have you! My name is Zuzana, and over the next few days, I will be helping you to get started faster. With the Starter plan, you can collaborate with as many people as you like on up to 3 design projects.For the next 14 days of free trial, you have a chance to see for yourself how Avocode will help you and your team optimise design coding and handoff.',
			isRead: false,
			isStarred: true,
			isDraft: false,
			sentAt: 1551133930597
		},
		{
			from: 'Birdy',
			to: MY_MAIL,
			id: utilService.makeId(),
			subject: 'How you doing?',
			body: 'Hello shmuel, We’re so glad to have you! My name is Zuzana, and over the next few days, I will be helping you to get started faster. With the Starter plan, you can collaborate with as many people as you like on up to 3 design projects.For the next 14 days of free trial, you have a chance to see for yourself how Avocode will help you and your team optimise design coding and handoff.',
			isRead: false,
			isStarred: false,
			isDraft: false,
			sentAt: 1551133930597
		}
	];
	return emails;
}
