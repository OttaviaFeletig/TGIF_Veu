//if (document.title == "Congress 113: Senate") {
//    myData();
//} else {
//    myStatistics();
//}
//
//function myData() {

var dataObj = new Vue({

    el: '#table',
    data: {
        urlSenate: "https://api.propublica.org/congress/v1/113/senate/members.json",
        urlHouse: "https://api.propublica.org/congress/v1/113/house/members.json",
        politician: [],
        checkedParty: [],
        state: [],
        checkedState: "all",

        democratsMembersList: [],
        republicansMembersList: [],
        independentsMembersList: [],

        democratsMembersNumber: 0,
        republicansMembersNumber: 0,
        independentsMembersNumber: 0,
        totalMembersNumber: 0,

        democratsMembersPct: 0,
        republicansMembersPct: 0,
        independentsMembersPct: 0,
        totalMembersPct: 0,

        index10Pct: 0,
        votes10PercentMostLoyal: 0,
        votes10PercentLeastLoyal: 0,

        mostLoyal: [],
        leastLoyal: [],

        mostEngaged: [],
        leastEngaged: [],

        isLoading: true
    },
    computed: {
        filter: function () {
            if (!this.checkedParty.length && this.checkedState == "all") {

                return this.politician;

            } else if (this.checkedState == "all" || !this.checkedParty.length) {

                return this.politician.filter(x => this.checkedParty.includes(x.party)

                    ||

                    this.checkedState == x.state);

            } else {

                return this.politician.filter(x => this.checkedParty.includes(x.party)

                    &&

                    this.checkedState == x.state);
            }
        }
    },
    created() {
        
        if (document.title.includes("Senate")) {
            this.loadFetchSenate(this.urlSenate);
        } else {
            this.loadFetchSenate(this.urlHouse);
        }
    },
    methods: {
        getStateList: function () {

            // Set is an object that doesn't allow to have inside himself only unique values

            var sortedState = new Set(this.politician.map(i => i.state).sort());

            console.log(sortedState);
            console.log([...sortedState]);

            // but as Set is an object i want to put in into an array and with these ... I am iterating through all the items of the object and putting them into the array

            this.state = [...sortedState];

        },
        getMembersNumber: function () {

            this.democratsMembersList = this.politician.filter(onePolitician => onePolitician.party.includes("D"));

            this.democratsMembersNumber = this.democratsMembersList.length;

            this.republicansMembersList =
                this.politician.filter(onePolitician => onePolitician.party.includes("R"));

            this.republicansMembersNumber = this.republicansMembersList.length;

            this.independentsMembersList = this.politician.filter(onePolitician => onePolitician.party.includes("I"));

            this.independentsMembersNumber = this.independentsMembersList.length;

            this.totalMembersNumber = this.democratsMembersNumber + this.republicansMembersNumber + this.independentsMembersNumber;

        },
        getMembersPct: function () {

            this.democratsMembersPct = Math.round(this.democratsMembersList.map(pct => pct.votes_with_party_pct).reduce((a, b) => a + b, 0) / this.democratsMembersList.length * 100) / 100 || 0;

            this.republicansMembersPct = Math.round(this.republicansMembersList.map(pct => pct.votes_with_party_pct).reduce((a, b) => a + b, 0) / this.republicansMembersList.length * 100) / 100 || 0;

            this.independentsMembersPct = Math.round(this.independentsMembersList.map(pct => pct.votes_with_party_pct).reduce((a, b) => a + b, 0) / this.independentsMembersList.length * 100) / 100 || 0;

            this.totalMembersPct = Math.round((this.democratsMembersPct + this.republicansMembersPct + this.independentsMembersPct) / 3 * 100) / 100;

        },
        get10PctIndex: function () {

            this.index10Pct = Math.round(10 * this.politician.length / 100) - 1;

        },
        getLoyaltyList: function () {

            this.votes10PercentMostLoyal = this.politician.map(el => el.votes_with_party_pct).sort((a, b) => b - a)[this.index10Pct];

            this.votes10PercentLeastLoyal = this.politician.map(el => el.votes_with_party_pct).sort((a, b) => a - b)[this.index10Pct];

            this.mostLoyal = this.politician
                .filter(x => x.votes_with_party_pct >= this.votes10PercentMostLoyal)
                .sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct);

            this.leastLoyal = this.politician
                .filter(x => x.votes_with_party_pct <= this.votes10PercentLeastLoyal)
                .sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct);

        },
        getAttendanceList: function () {

            this.votes10PercentMostEngaged = this.politician.map(el => el.missed_votes_pct).sort((a, b) => a - b)[this.index10Pct];

            this.votes10PercentLeastEngaged = this.politician.map(el => el.missed_votes_pct).sort((a, b) => b - a)[this.index10Pct];

            this.mostEngaged = this.politician
                .filter(x => x.missed_votes_pct <= this.votes10PercentMostEngaged)
                .sort((a, b) => a.missed_votes_pct - b.missed_votes_pct);

            this.leastEngaged = this.politician
                .filter(x => x.missed_votes_pct >= this.votes10PercentLeastEngaged)
                .sort((a, b) => b.missed_votes_pct - a.missed_votes_pct);

        },
        loadFetchSenate: function (url) {
            fetch(url, {
                    method: 'GET',
                    headers: {
                        'X-API-Key': 'LFCEVBEkx4netIVuHk7KU0nh79yiglVnKgXTutlh'
                    }
                })
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    dataObj.isLoading = false;
                    console.log(dataObj.isLoading)
                    dataObj.politician = data.results[0].members;
                    if (document.title.includes("Congress 113")) {
                        dataObj.getStateList();
                    } else {
                        dataObj.getMembersNumber();
                        dataObj.getMembersPct();
                        dataObj.get10PctIndex();
                        if (document.title.includes("Loyalty")) {
                            dataObj.getLoyaltyList();
                        } else {
                            dataObj.getAttendanceList();
                        }
                    }
                })
        }
    }
});




//}
