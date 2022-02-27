import React, {useState, useRef} from 'react';
import {useWindowSize} from "./../services/useWindowSize";
import searchImg from '../assets/image/search.png';
import './Filter.css';

export const Filter = ({term, searchKeyword, filterBy, isEmail, isBook, isNote, newListIconLeftDis}) => {
    const [filter, setFilter] = useState('all');
    const size = useWindowSize();
    const windowWidth = size.width;
    const filterWidth = windowWidth - 2 * (windowWidth - (newListIconLeftDis + 130));

    const inputEl = useRef();
    const placeholder = "Search " + (isEmail ? "mail" : isBook ? "book" : "note") + (isNote ? ' ...' : '');
    const emailFilterOptions = <>
        <option value="all">All</option>
        <option value="isRead">Read</option>
        <option value="unRead">Unread</option>
    </>;

    const bookFilterOptions = <>
        <option value="all">All</option>
        <option value="fantasy">Fantasy</option>
        <option value="fiction">Fiction</option>
        <option value="photography">Photography</option>
        <option value="history">History</option>
        <option value="education">Education</option>
        <option value="art">Art</option>
        <option value="adventure">Adventure</option>
    </>;

    const getSearchTerm = () => {
        //instead of using event.target.value
        searchKeyword(inputEl.current.value);
    };

    const handleChange = (ev) => {
        setFilter(ev.target.value);
        filterBy(ev.target.value);
    };

    return (
        <section className={`filter ${ isBook?'booksFilter':'' }`}
            style={{width: `${ isNote ? (filterWidth) : null }px`}}>
            {!isNote && <img src={searchImg} alt="" />}
            <input
                type="text"
                placeholder={placeholder}
                autoComplete="off"
                autoFocus
                name="txt"
                value={term}
                className="filter-by-name"
                onChange={getSearchTerm}
                ref={inputEl}
                style={{paddingLeft: `${ isNote ? '10px' : '' }`}}
            />
            {!isNote && <select name="option" value={filter} onChange={handleChange} className="filter-option">
                {isEmail && emailFilterOptions}
                {isBook && bookFilterOptions}
            </select>}
        </section>
    );
};;





// export class MailFilter extends React.Component {

//     state = {
//         filterBy: {
//             subject: ''
//         }
//     };

//     handleChange = (ev) => {
//         const callback = () => {
//             this.props.setFilter(this.state.filterBy);
//         };

//         const filterBy = { ...this.state.filterBy }
//         filterBy[ev.target.name] = ev.target.value;

//         this.setState({ filterBy }, callback);
//     };

//     render() {
//         return <section className="mail-filter">
//             <input type="text" name="subject"
//                 value={this.state.filterBy.name}
//                 placeholder="Filter by subject"
//                 autoComplete="off"
//                 onChange={this.handleChange} />
//         </section>;
//     }

// }