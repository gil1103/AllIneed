import React from 'react';
import './About.css';

export const About = () => {
    return (
        <section className="about-page">
            <div className="about-container">
                <h1 className="about-header">About</h1>
                <div className="preface">
                    <p>Hey my name is Gil and I am a fullstack developer</p>
                    <p>Started my career as a mechanical engineer and untill recentely</p>
                    <p>managed large scale software projects in a global company</p>
                    <p>I am a certified scrum master and hold PMP certificate from the Technion </p>
                </div>
                {/* <br /> */}
                <strong className="about-sub-title">My software education</strong>
                <ul>
                    <li>Graduated from development and software engineering program at the Technion</li>
                    <li>Graduated from the tough coding Academy bootcamp</li>
                    <li>Completed 1 year of self learning in order to deepend my programing skills 
                        and gain experiance through building meaningfull projects</li>
                    <li>During that time I completed more than 10 projects published on my Github pages</li>
                </ul>
                <div className="github-link">
                    <a href="https://github.com/gil1103">My Github</a>
                </div>


            </div>

        </section>
    );
};


