import React, {useState, useRef} from 'react';
import searchImg from '../images/search.png';
import './EmailFilter.css';

export const EmailFilter = ({term, searchKeyword, filterBy}) => {
    const [filter, setFilter] = useState('all');
    const inputEl = useRef();

    const getSearchTerm = () => {
        //instead of using event.target.value
        searchKeyword(inputEl.current.value);
    };

    const handleChange = (ev) => {
        setFilter(ev.target.value);
        filterBy(ev.target.value);
    };

    return (
        <section className="email-filter">
            <img src={searchImg} alt="" />
            <input
                type="text"
                placeholder="Search mail"
                autoComplete="off"
                autoFocus
                name="txt"
                value={term}
                className="filter-by-name"
                onChange={getSearchTerm}
                ref={inputEl}
            />
            <select name="option" value={filter} onChange={handleChange} className="filter-option">
                <option value="all">All</option>
                <option value="isRead">Read</option>
                <option value="unRead">Unread</option>
            </select>
        </section>
    );
};








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