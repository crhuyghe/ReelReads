import random


def get_quizzes():
    movie_questions = [
        ("What is the name of the snowman in 'Frozen'?", ["Frosty", "Snowy", "Olaf", "Iceman"], "Olaf"),
        ("Which 1995 film is considered the first full-length computer-animated feature?", ["A Bug's Life", "Monsters, Inc.", "Finding Nemo", "Toy Story"], "Toy Story"),
        ("What type of fish is Nemo in 'Finding Nemo'?", ["Goldfish", "Betta", "Clownfish", "Guppy"], "Clownfish"),
        ("Who is the fashion designer in 'The Incredibles'?", ["Edna Mode", "Mirage", "Violet", "Elastigirl"], "Edna Mode"),
        ("What animated movie features a character named Hiccup?", ["Brave", "How to Train Your Dragon", "Shrek", "Kung Fu Panda"], "How to Train Your Dragon"),
        ("What is the main character’s name in 'Ratatouille'?", ["Remy", "Linguini", "Colette", "Gusteau"], "Remy"),
        ("Which animated film features a superhero family?", ["Big Hero 6", "Zootopia", "The Incredibles", "Inside Out"], "The Incredibles"),
        ("What is the name of the princess in 'The Princess and the Frog'?", ["Ariel", "Belle", "Tiana", "Jasmine"], "Tiana"),
        ("In 'Zootopia', what animal is Judy Hopps?", ["Fox", "Elephant", "Rabbit", "Lion"], "Rabbit"),
        ("Who provided the voice for Genie in the 1992 'Aladdin'?", ["Tom Hanks", "Jim Carrey", "Robin Williams", "Will Smith"], "Robin Williams"),
        ("Which movie features a villain named Lord Farquaad?", ["Shrek", "Tangled", "Frozen", "Moana"], "Shrek"),
        ("In 'Fight Club,' what rule is most associated with Fight Club?", ["You do not talk about Fight Club", "Always fight", "No rules", "Fight to win"],"You do not talk about Fight Club"),
        ("In 'Office Space', what is the name of the main character?", ["Michael Bolton", "Bill Lumbergh", "Peter Gibbons", "Samir Nagheenanajar"], "Peter Gibbons"),
        ("In 'Harry Potter', what is the name of Harry's pet owl?", ["Errol", "Pigwidgeon", "Hedwig", "Fawkes"], "Hedwig"),
        ("In 'The Chronicles of Narnia', what is the name of the lion?", ["Aslan", "Simba", "Mufasa", "Scar"], "Aslan"),
        ("What fantasy series involves a dark lord known as Sauron?", ["Harry Potter", "The Chronicles of Narnia", "The Lord of the Rings", "Percy Jackson"],"The Lord of the Rings"),
        ("What is the fictional sport played in 'Harry Potter'?", ["Soccer", "Quidditch", "Basketball", "Rugby"],"Quidditch"),
        ("Which person has not held the title of Captain America in the MCU?", ["Steve Rogers", "John Walker", "Tony Stark", "Sam Wilson"], "Tony Stark"),
        ("Who cut Thanos' head off in 'Avengers: Endgame'?", ["Iron Man", "Thor", "Hulk", "Captain America"], "Thor"),
        ("In 'Avengers: Endgame', which infinity stone does Natasha sacrifice herself for?", ["Soul Stone", "Time Stone", "Mind Stone", "Power Stone"], "Soul Stone"),
        ("In Thor: Ragnarok, who does Thor fight in the arena while stuck on Sakaar?", ["Loki", "The Hulk", "Hela", "Valkyrie"], "The Hulk"),
        ("In 'Star Wars', what is the name of Han Solo's ship?", ["X-Wing", "TIE Fighter", "Millennium Falcon", "Star Destroyer"], "Millennium Falcon"),
        ("What was the first feature-length animated movie ever released?", ["Cinderella", "Sleeping Beauty", "Snow White and the Seven Dwarfs", "Pinocchio"], "Snow White and the Seven Dwarfs"),
        ("What Star Wars movie was released in 1977?", ["The Empire Strikes Back", "Return of the Jedi", "A New Hope", "The Phantom Menace"], "A New Hope"),
        ("In 'The Matrix', what color pill does Neo take?", ["Blue", "Red", "Green", "Yellow"], "Red"),
    ]
    book_questions = [
        ("A young boy takes a train to the North Pole on Christmas Eve in what classic 1985 children's book by Chris Van Allsburg?", ["The Polar Express", "The Christmas Train", "The Snowman", "The Winter Express"], "The Polar Express"),
        ("In the classic 1957 children's book, 'How the Grinch Stole Christmas,' what is the name of the town the Grinch steals holiday presents and decorations from?", ["Whoville", "Grinchville", "Christmas Town", "Holidayville"], "Whoville"),
        ("What is the name of the third book in the Twilight series by Stephenie Meyer?", ["Eclipse", "New Moon", "Breaking Dawn", "Twilight"], "Eclipse"),
        ("In 'The Lion, the Witch, and the Wardrobe,' what magical country does the White Witch put a spell on so that it is always winter but never Christmas?", ["Narnia", "Hogwarts", "Middle Earth", "Wonderland"], "Narnia"),
        ("'Draco Dormiens Nunquam Titillandus,' translated as 'Never Tickle A Sleeping Dragon,' is the official motto for what fictional place of learning?", ["Hogwarts", "Beauxbatons", "Durmstrang", "Ilvermorny"], "Hogwarts"),
        ("Thestrals and Floo Powder are both forms of transportation invented by what internationally-renowned author?", ["JK Rowling", "JRR Tolkien", "George RR Martin", "CS Lewis"], "JK Rowling"),
        ("What 1847 Emily Bronte classic deals with two West Yorkshire families, the Earnshaws and the Lintons, and in particular the adopted Earnshaw, Heathcliff?", ["Wuthering Heights", "Jane Eyre", "Pride and Prejudice", "Great Expectations"], "Wuthering Heights"),
        ("A large portion of what 2001 Yann Martel novel features the title character stranded on a lifeboat after a shipwreck with a Bengal tiger named Richard Parker?", ["Life of Pi", "The Old Man and the Sea", "Moby Dick", "The Jungle Book"], "Life of Pi"),
        ("Named after a London railway station, what fictional literary bear was originally a stowaway from 'Darkest Peru?'", ["Paddington Bear", "Winnie the Pooh", "Rupert Bear", "Baloo"], "Paddington Bear"),
        ("The Berenstain Bears live in what interesting type of home?", ["Treehouse", "Cave", "Burrow", "Nest"], "Treehouse"),
        ("What is the name of the dancing clown in Stephen King's famed horror novel 'It?'", ["Pennywise", "Bozo", "Krusty", "Ronald"], "Pennywise"),
        ("What British Author wrote 'The Cricket on the Hearth' and 'A Christmas Carol?'", ["Charles Dickens", "Jane Austen", "William Shakespeare", "George Orwell"], "Charles Dickens"),
        ("What is the name of the first book in the 'Harry Potter' series?", ["Harry Potter and the Sorcerer's Stone", "Harry Potter and the Chamber of Secrets", "Harry Potter and the Prisoner of Azkaban", "Harry Potter and the Goblet of Fire"], "Harry Potter and the Sorcerer's Stone"),
        ("What is the name of the second book in the 'Harry Potter' series?", ["Harry Potter and the Chamber of Secrets", "Harry Potter and the Sorcerer's Stone", "Harry Potter and the Prisoner of Azkaban", "Harry Potter and the Goblet of Fire"], "Harry Potter and the Chamber of Secrets"),
        ("Who wrote the 'Chronicles of Narnia' series?", ["C.S. Lewis", "J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin"], "C.S. Lewis"),
        ("In 'The Great Gatsby,' who is the narrator of the story?", ["Nick Carraway", "Jay Gatsby", "Tom Buchanan", "Daisy Buchanan"], "Nick Carraway"),
        ("What is the name of the fictional school attended by the Baudelaire orphans in 'A Series of Unfortunate Events'?", ["Prufrock Preparatory School", "Hogwarts", "Sunnydale High", "Springfield Elementary"], "Prufrock Preparatory School"),
        ("In 'To Kill a Mockingbird,' who is the father of Scout and Jem?", ["Atticus Finch", "Tom Robinson", "Boo Radley", "Bob Ewell"], "Atticus Finch"),
        ("What is the name of the dragon in J.R.R. Tolkien's 'The Hobbit'?", ["Smaug", "Drogon", "Falkor", "Norbert"], "Smaug"),
        ("In 'Pride and Prejudice,' who is Elizabeth Bennet's love interest?", ["Mr. Darcy", "Mr. Bingley", "Mr. Collins", "Mr. Wickham"], "Mr. Darcy"),
        ("What is the name of the dystopian novel by George Orwell that features Big Brother?", ["1984", "Brave New World", "Fahrenheit 451", "The Handmaid's Tale"], "1984"),
        ("In 'The Catcher in the Rye,' who is the protagonist?", ["Holden Caulfield", "Jay Gatsby", "Atticus Finch", "Scout Finch"], "Holden Caulfield"),
        ("What is the name of the wizarding bank in 'Harry Potter'?", ["Gringotts", "Bank of England", "Wells Fargo", "Hogwarts Bank"], "Gringotts"),
        ("In 'The Hunger Games,' who is the main female protagonist?", ["Katniss Everdeen", "Hermione Granger", "Bella Swan", "Tris Prior"], "Katniss Everdeen"),
        ("What is the name of the author of 'The Da Vinci Code'?", ["Dan Brown", "Stephen King", "J.K. Rowling", "Agatha Christie"], "Dan Brown"),
    ]

    selected_movie_questions = random.sample(movie_questions, 5)
    selected_book_questions = random.sample(book_questions, 5)

    selected_questions = selected_movie_questions + selected_book_questions
    random.shuffle(selected_questions)

    questions = []
    answers = []
    correct_answers = []

    for question, options, answer in selected_questions:
        scrambled_options = random.sample(options, len(options))
        questions.append(question)
        answers.append(scrambled_options)
        correct_answers.append(answer)

    return questions, answers, correct_answers


if __name__ == "__main__":
    get_quizzes()
