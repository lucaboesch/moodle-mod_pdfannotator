/*
 * This file is a collection of JavaScript functions that control the behaviour
 * of the overview pages / templates for both student and teacher
 *
 * @package   mod_pdfannotator
 * @copyright 2018 onward RWTH Aachen, Rabea de Groot and Anna Heynkes (see README.md)
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 *
 * @param {type} Y
 * @param {type} __annotatorid
 * @param {type} __role
 * @return {undefined}
 */
function startOverview(Y, __annotatorid, __cmid, __capabilities, __action) { // Wrapper function that is called by controller.php

    require(['jquery', 'core/templates', 'core/notification'], function ($, templates, notification) {

        /************************** 1. Call initialising functions **************************/

        styleTableReset();

        hideAlert();

        addDropdownNavigation(null, __capabilities, __cmid);

        if (__action === 'overviewquestions') {
            enableFilteringOfQuestions();
        } else if (__action === 'overviewanswers') {
            enableFilteringOfAnswers();
        } else if (__action === 'overviewreports') {
            enableFilteringOfReports();
        }

        shortenTextOverview();
        //renderMathJax();

        /************************** 2. Function definitions **************************/

        /**
         * Function reduces the extra white space for the 'reset table' option added after table sort.
         *
         * @returns {undefined}
         */
        function styleTableReset() {
            var resetlink = document.getElementsByClassName('resettable mdl-right')[0];
            var filtercontainer = document.getElementById('pdfannotator-filter');
            if ( (typeof resetlink != 'undefined') && (typeof filtercontainer != 'undefined')) {
                $(resetlink).insertAfter(filtercontainer);
            }
        }
        /**
         * Function removes residual info boxes from the top of the page (if present, e.g. after unsubscribing).
         *
         * @returns {undefined}
         */
        function hideAlert() {
            setTimeout(function () {
                let notificationpanel = document.getElementById("pdfannotator_notificationpanel");
                if (notificationpanel instanceof Object) {
                    while (notificationpanel.hasChildNodes()) {
                        notificationpanel.removeChild(notificationpanel.firstChild);
                    }
                }
            }, 5000);
        }
        function enableFilteringOfQuestions() {

            var query = window.location.search;

            // 1. Create a selection element.
            var filter = document.createElement("SELECT");
            filter.setAttribute("id", "questionfilter");
            filter.classList.add('custom-select');

            let openquestions = document.createElement("OPTION");
            openquestions.value = 0;
            openquestions.text = M.util.get_string('openquestions', 'pdfannotator');

            let closedquestions = document.createElement("OPTION");
            closedquestions.value = 1;
            closedquestions.text = M.util.get_string('closedquestions', 'pdfannotator');

            let allquestions = document.createElement("OPTION");
            allquestions.value = 2;
            allquestions.text = M.util.get_string('allquestions', 'pdfannotator');

            // 2. Set current choice.
            var filtername = 'questionfilter=';
            var pos = query.indexOf(filtername);
            if (pos !== null && pos != -1) {
                let pastchoice = query.slice(pos + filtername.length, pos + filtername.length + 1);
                if (pastchoice === '0') {
                    openquestions.selected = true;
                } else if (pastchoice === '1') {
                    closedquestions.selected = true;
                } else {
                    allquestions.selected = true;
                }
            } else {
                openquestions.selected = true; // Default.
            }

            // 3. Add options.
            filter.add(openquestions);
            filter.add(closedquestions);
            filter.add(allquestions);

            // 4. Place filter next to the headline.
            var container = document.getElementById('pdfannotator-filter');
            container.appendChild(filter);

            // 5. Add functionality to the selection element.
            addFilterEventlistener(filter, filtername, query, pos);

        }

        function enableFilteringOfAnswers() {

            var query = window.location.search;

            // 1. Create a selection element.
            var filter = document.createElement("SELECT");
            filter.setAttribute("id", "answerfilter");
            filter.classList.add('custom-select');

            let option0 = document.createElement("OPTION");
            option0.value = 0;
            option0.text = M.util.get_string('allanswers', 'pdfannotator');

            let option1 = document.createElement("OPTION");
            option1.value = 1;
            option1.text = M.util.get_string('subscribedanswers', 'pdfannotator');

            // 2. Set current choice.
            var filtername = 'answerfilter=';
            var pos = query.indexOf(filtername);
            if (pos !== null && pos != -1) {
                let pastchoice = query.slice(pos + filtername.length, pos + filtername.length + 1);
                if (pastchoice === '0') {
                    option0.selected = true;
                } else {
                    option1.selected = true;
                }
            } else {
                option1.selected = true; // Default.
            }

            // 3. Add options.
            filter.add(option0);
            filter.add(option1);

            // 4. Place filter next to the headline.
            var container = document.getElementById('pdfannotator-filter');
            container.appendChild(filter);

            // 5. Add functionality to the selection element.
            addFilterEventlistener(filter, filtername, query, pos);

        }
        /**
         * This function adds a select option. Users can choose to see all reports,
         * only unseen reports or only seen reports.
         *
         * @returns {undefined}
         */
        function enableFilteringOfReports() {

            var query = window.location.search;

            // 1. Create a selection element.
            var filter = document.createElement("SELECT");
            filter.setAttribute("id", "reportfilter");
            filter.classList.add('custom-select');

            let option0 = document.createElement("OPTION");
            option0.value = 2;
            option0.text = M.util.get_string('allreports', 'pdfannotator');

            let option1 = document.createElement("OPTION");
            option1.value = 0;
            option1.text = M.util.get_string('unseenreports', 'pdfannotator');

            let option2 = document.createElement("OPTION");
            option2.value = 1;
            option2.text = M.util.get_string('seenreports', 'pdfannotator');

            // 2. Set current choice.
            var filtername = 'reportfilter=';
            var pos = query.indexOf(filtername);
            if (pos !== null && pos != -1) {
                let pastchoice = query.slice(pos + filtername.length, pos + filtername.length + 1);
                if (pastchoice === '2') {
                    option0.selected = true;
                } else if (pastchoice === '0') {
                    option1.selected = true;
                } else {
                    option2.selected = true;
                }
            } else {
                option1.selected = true; // Default.
            }

            // 3. Add options.
            filter.add(option0);
            filter.add(option1);
            filter.add(option2);

            // 4. Place filter next to the headline.
            var container = document.getElementById('pdfannotator-filter');
            container.appendChild(filter);

            // 5. Add functionality to the selection element.
            addFilterEventlistener(filter, filtername, query, pos);

        }

        function addFilterEventlistener(filter, filtername, query, pos) {
            filter.onchange = function () {
                var select = this;
                select = this.options[select.selectedIndex];
                select.selected = true;
                var newurl = window.location.pathname + query;
                var regex = new RegExp(filtername + '(\\d+)');
                if (pos !== null && pos != -1) {
                    newurl = newurl.replace(regex, filtername + select.value);
                } else {
                    newurl += '&' + filtername + select.value;
                }
                // Go back to page 0, because the current page might not exist anymore after filtering.
                var pagepos = query.indexOf('&page=');
                if ( (pagepos !== null) && (pagepos != -1)) {
                    newurl = newurl.replace(/page=(\d+)/, 'page=0');
                }
                window.location.href = newurl;
            };
        }

    });
    /**
     * Shorten display of any report or question to a maximum of 120 characters and display
     * a 'view more'/'view less' link
     *
     * Copyright 2013 Viral Patel and other contributors
     * http://viralpatel.net
     *
     * slightly modified by RWTH Aachen in 2018-2019
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     *
     * @param {type} $
     * @returns {undefined}
     */
    function shortenTextOverview() {
        require(['jquery'], function ($) {

            var baseShowChar = 120;
            var ellipsestext = '...';
            var moretext = M.util.get_string('showmore', 'pdfannotator');
            var lesstext = M.util.get_string('showless', 'pdfannotator');

            $('.more').each(function () {

                // --- SOURCE TEXT ---
                let rawText = this.innerText || '';

                // STEP 1: Convert literal "\n" into real newlines
                rawText = rawText.replace(/\\n/g, '\n');

                // STEP 2: Normalize Windows/Mac line endings
                rawText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

                // STEP 3: Trim outer whitespace only
                rawText = rawText.trim();

                // STEP 4: Convert real newlines to HTML
                let content = rawText.replace(/\n/g, '<br>');

                // --- EXTRACT OPTIONAL LABEL SPAN ---
                let originalHtml = this.innerHTML;
                let posbegin = originalHtml.indexOf('<span');
                let labelspan = '';

                if (posbegin !== -1) {
                    let posend = originalHtml.indexOf('</span>', posbegin);
                    if (posend !== -1) {
                        labelspan = originalHtml.slice(posbegin, posend + 7);

                        let labeltext = labelspan
                            .replace(/<[^>]+>/g, '')   // extract text only
                            .trim();

                        content = content.replace(labeltext, '');
                        labelspan = '<br>' + labelspan;
                    }
                }

                // --- DYNAMIC CLIP WIDTH ---
                let widthParent = $(this).parent()[0]?.offsetWidth || 917;
                let showChar = Math.floor(widthParent / 3);
                showChar = Math.max(showChar, baseShowChar);

                if (content.length <= showChar + ellipsestext.length) {
                    $(this).html(content + labelspan);
                    return;
                }

                // ---- PROTECT MATHJAX EXPRESSIONS ----
                let x = 0;
                let guard = 0;

                while (guard < 1000) {
                    guard++;

                    let i1 = content.indexOf('\\(', x);
                    let i2 = content.indexOf('\\[', x);
                    let i3 = content.indexOf('$$', x);

                    if (i1 === -1 && i2 === -1 && i3 === -1) break;

                    let candidates = [i1, i2, i3].filter(v => v !== -1);
                    let i = Math.min.apply(null, candidates);

                    if (i > showChar) break;

                    let close;
                    if (i === i1) close = content.indexOf('\\)', i + 2);
                    else if (i === i2) close = content.indexOf('\\]', i + 2);
                    else close = content.indexOf('$$', i + 2);

                    if (close === -1) break;

                    x = close + 2;
                    showChar = Math.max(showChar, x);
                }

                // --- SPLIT CONTENT ---
                let c = content.substr(0, showChar);
                let h = content.slice(showChar);

                // --- FINAL HTML ---
                let html =
                    c +
                    '<span class="moreellipses">' +
                    ellipsestext +
                    '&nbsp;</span>' +
                    '<span class="morecontent"><span>' +
                    h +
                    '</span>&nbsp;&nbsp;<a href="#" class="morelink">' +
                    moretext +
                    '</a></span>' +
                    labelspan;

                $(this).html(html);
            });

            // --- TOGGLE HANDLER ---
            $(document).on('click', '.morelink', function () {

                if ($(this).hasClass('less')) {
                    $(this).removeClass('less').html(moretext);
                } else {
                    $(this).addClass('less').html(lesstext);
                }

                $(this).parent().prev().toggle(); // ellipses
                $(this).prev().toggle();          // hidden content

                return false;
            });
        });
    }
}