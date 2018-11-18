import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import MaskedInput from 'react-text-mask';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from "@material-ui/core/TextField";

import I18n from '../i18n';

const styles = theme => ({
    hr: {
        border: 0,
        borderTop: '1px solid gray'
    },
    rowDiv: {
        width: '100%',
    },
    modeDiv: {
        width: 200,
        display: 'inline-block',
        verticalAlign: 'top'
    },
    settingsDiv: {
        display: 'inline-block',
        verticalAlign: 'top'
    },
    inputTime: {
        width: 60,
        marginTop: 0,
        marginLeft: 5
    },
    inputDate: {
        width: 120,
        marginTop: 0,
        marginLeft: 5
    },
    inputEvery: {
        width: 40,
        marginLeft: 5,
        marginRight: 5,
    },
    inputRadio: {
        padding: '4px 12px',
        verticalAlign: 'top'
    },
    inputGroup: {
        maxWidth: 400,
        display: 'inline-block'
    },
    inputGroupElement: {
        width: 120,
    },
    inputDateDay: {
        width: 60,
    },
    inputDateDayCheck: {
        padding: 4,
    },
    inputSmallCheck: {
        padding: 0,
    },
    rowOnce: {

    },
    rowDays: {
        background: '#FFDDDD'
    },
    rowDows: {
        background: '#DDFFDD'
    },
    rowDates: {
        background: '#DDDDFF'
    },
    rowWeeks: {
        background: '#DDDDFF'
    },
    rowMonths: {
        background: '#DDFFFF'
    },
    rowMonthsDates: {
        background: '#EEFFFF',
        maxWidth: 600
    },
    rowYears: {
        background: '#FFDDFF'
    },
    rowDaysDows: {
        background: '#FFEEEE',
        paddingLeft: 10,
        paddingBottom: 10
    },
    rowDowsDows: {
        background: '#EEFFEE',
        paddingLeft: 10,
        paddingBottom: 10
    }
});

const WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];
const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const PERIODS = {
    'minutes': 'minutes',
    'hours': 'hours',
};
const ASTRO = [
    'sunrise',
    'sunriseEnd',
    'goldenHourEnd',
    'solarNoon',
    'goldenHour',
    'sunsetStart',
    'sunset',
    'dusk',
    'nauticalDusk',
    'night',
    'nightEnd',
    'nauticalDawn',
    'dawn',
    'nadir',
];

function padding(num) {
    if (num < 10) return '0' + num;
    return '' + num;
}

function TextTime(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={inputRef}
            mask={[/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/]}
            placeholderChar={props.placeholder || '00:00'}
            showMask
        />
    );
}

TextTime.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

function TextDate(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={inputRef}
            mask={[/[0-3]/, /[0-9]/, '.', /[0-1]/, /[0-9]/, '.', '2', '0', /[0-9]/, /[0-9]/]}
            placeholderChar={props.placeholder || '01.01.2019'}
            showMask
        />
    );
}

TextDate.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

const DEFAULT = {
    time: {
        exactTime: false,

        start: '00:00',
        end: '23:59',

        mode: 'hours',
        interval: 1,
    },
    period: {
        once: '',
        days: 1,
        dows: '',
        dates: '',
        weeks: 0,
        months: '',
        years: 0,
    },
    valid: {
        from: '',
        to: ''
    }
};

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        let schedule;
        if (this.props.schedule && typeof this.props.schedule === 'string' && this.props.schedule[0] === '{') {
            try {
                schedule = JSON.parse(this.props.schedule);
            } catch (e) {

            }
        }

        if (!schedule) {
            if (this.props.onChange) {
                setTimeout(() => this.props.onChange(JSON.stringify(this.state.schedule)), 200);
            }
        }
        schedule = schedule || {};
        Object.assign(schedule, DEFAULT);
        schedule.valid.from = schedule.valid.from || this.now2string();

        this.state = {
            schedule,
            desc: this.state2text(schedule)
        };
    }

    onChange(schedule) {
        if (JSON.stringify(schedule) !== JSON.stringify(this.state.schedule)) {
            this.setState({schedule, desc: this.state2text(schedule)});
            this.props.onChange && this.props.onChange(JSON.stringify(schedule));
        }
    }

    state2text(schedule) {
        let desc = [];
        let validFrom = this.string2date(schedule.valid.from);
        // time
        if (schedule.time.exactTime) {
            if (ASTRO.indexOf(schedule.time.start) !== -1) {
                // at sunset
                desc.push(I18n.t('sch_desc_atTime'), I18n.t('sch_astro_' + schedule.time.start));
            } else {
                // at HH:MM
                desc.push(I18n.t('sch_desc_atTime'), schedule.time.start);
            }
        } else {
            if (schedule.time.mode === PERIODS.minutes) {
                if (schedule.time.interval === 1) {
                    // every minute
                    desc.push(I18n.t('sch_desc_everyMinute'));
                } else {
                    // every N minutes
                    desc.push(I18n.t('sch_desc_everyNMinutes', schedule.time.interval));
                }
            } else {
                if (schedule.time.interval === 1) {
                    // every minute
                    desc.push(I18n.t('sch_desc_everyHour'));
                } else {
                    // every N minutes
                    desc.push(I18n.t('sch_desc_everyNHours', schedule.time.interval));
                }
            }
            const start = ASTRO.indexOf(schedule.time.start) !== -1 ? I18n.t('sch_astro_' + schedule.time.start) : schedule.time.start;
            const end = ASTRO.indexOf(schedule.time.end) !== -1 ? I18n.t('sch_astro_' + schedule.time.end) : schedule.time.end;
            // from HH:mm to HH:mm
            desc.push(I18n.t('sch_desc_intervalFromTo', start, end));
        }

        // period
        const isOnce = !schedule.period.dows && !schedule.period.months && !schedule.period.dates && !schedule.period.years && !schedule.period.days && !schedule.period.weeks;
        if (isOnce) {
            const _validFromNextDay = new Date(validFrom);
            _validFromNextDay.setDate(_validFromNextDay.getDate() + 1);

            //
            if (_validFromNextDay < Date.now()) {
                // will ne be not executed any more, because start is in the past
                desc.push(I18n.t('sch_desc_onceInPast'));
            } else {
                // only once
                desc.push(I18n.t('sch_desc_once'));
            }
        } else {
            if (schedule.period.days) {
                if (schedule.period.days === 1) {
                    // every day
                    desc.push(I18n.t('sch_desc_onEveryDay'));
                } else {
                    // on every N days
                    desc.push(I18n.t('sch_desc_onEveryNDays', schedule.period.days));
                }
            }
            if (schedule.period.dows) {
                const dows = JSON.parse(schedule.period.dows);
                if (dows.length === 2 && dows[0] === 0 && dows[1] === 6) {
                    // on weekends
                    desc.push(I18n.t('sch_desc_onWeekends'));
                } else if (dows.length === 5 && dows[0] === 1 && dows[1] === 2 && dows[2] === 3 && dows[3] === 4 && dows[4] === 5) {
                    // on workdays
                    desc.push(I18n.t('sch_desc_onWorkdays'));
                } else {
                    const tDows = dows.map(day => I18n.t(WEEKDAYS[day]));
                    if (tDows.length === 1) {
                        // on Monday
                        desc.push(I18n.t('sch_desc_onWeekday', tDows[0]));
                    } else {
                        const last = tDows.pop();
                        // on Monday and Sunday
                        desc.push(I18n.t('sch_desc_onWeekdays', tDows.join(', '), last));
                    }

                }
            }
            if (schedule.period.weeks) {
                if (schedule.period.weeks === 1) {
                    // every day
                    desc.push(I18n.t('sch_desc_onEveryWeek'));
                } else {
                    // on every N days
                    desc.push(I18n.t('sch_desc_onEveryNWeeks', schedule.period.weeks));
                }
            }

            if (schedule.period.dates) {
                const dates = JSON.parse(schedule.period.dates);
                if (dates.length === 1) {
                    // in 1 of month
                    desc.push(I18n.t('sch_desc_onDate', dates[0]));
                } else {
                    const last = dates.pop();
                    // in 1 and 4 of month
                    desc.push(I18n.t('sch_desc_onDates', dates.join(', '), last));
                }
            }

            if (schedule.period.months) {
                if (typeof schedule.period.months === 'number') {
                    if (schedule.period.months === 1) {
                        // every day
                        desc.push(I18n.t('sch_desc_onEveryMonth'));
                    } else {
                        // on every N days
                        desc.push(I18n.t('sch_desc_onEveryNMonths', schedule.period.months));
                    }
                } else {
                    const months = JSON.parse(schedule.period.months);
                    const tMonths = months.map(month => I18n.t(MONTHS[month]));
                    if (tMonths.length === 1) {
                        // in January
                        desc.push(I18n.t('sch_desc_onMonth', tMonths[0]));
                    } else {
                        const last = tMonths.pop();
                        // in January and May
                        desc.push(I18n.t('sch_desc_onMonths', tMonths.join(', '), last));
                    }
                }
            }

            if (schedule.period.years) {
                if (schedule.period.years === 1) {
                    // every day
                    desc.push(I18n.t('sch_desc_onEveryYear'));
                } else {
                    // on every N days
                    desc.push(I18n.t('sch_desc_onEveryNYears', schedule.period.years));
                }
            }
        }

        // valid
        if (validFrom.getTime() > Date.now() && schedule.valid.to) {
            // from XXX to XXXX
            desc.push(I18n.t('sch_desc_validFromTo', schedule.valid.from, schedule.valid.to));
        } else if (validFrom.getTime() > Date.now()) {
            // from XXXX
            desc.push(I18n.t('sch_desc_validFrom', schedule.valid.from));
        } else if (schedule.valid.to) {
            // till XXXX
            desc.push(I18n.t('sch_desc_validTo', schedule.valid.to));
        }
        return desc.join(' ');
    }

    getTimePeriodElements() {
        const schedule = this.state.schedule;
        let wholeDay = false;
        let day = false;
        let night = false;
        let fromTo = true;
        if (schedule.time.start === '00:00' && schedule.time.end === '24:00') {
            wholeDay = true;
            fromTo = false;
        } else if (schedule.time.start === 'sunrise') {
            day = true;
            fromTo = false;
        } else if (schedule.time.start === 'sunset') {
            night = true;
            fromTo = false;
        }

        return (
            <div key="timePeriod" className={this.props.classes.rowDiv}>
                <div className={this.props.classes.modeDiv}>
                    <FormControlLabel control={<Radio className={this.props.classes.inputRadio} checked={!schedule.time.exactTime} onClick={() => {
                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                        schedule.time.exactTime = false;
                        this.onChange(schedule);
                    }}/>} label={I18n.t('sch_intervalTime')} />
                </div>
                <div className={this.props.classes.settingsDiv}>
                    <div className={this.props.classes.settingsDiv}>
                        {!schedule.time.exactTime && (<div>
                            <div><FormControlLabel control={<Radio className={this.props.classes.inputRadio} checked={fromTo} onClick={() => {
                                const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                schedule.time.start = '00:00';
                                schedule.time.end = '23:59';
                                this.onChange(schedule);
                            }}/>} label={!fromTo ? I18n.t('sch_fromTo') : ''} />
                                {fromTo && [
                                    (<TextField
                                        className={this.props.classes.inputTime}
                                        style={{marginRight: 10}}
                                        key="exactTimeFrom"
                                        value={this.state.schedule.time.start}
                                        //InputProps={{inputComponent: TextTime}}
                                        onChange={e => {
                                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                            schedule.time.start = e.target.value;
                                            this.onChange(schedule);
                                        }}
                                        InputLabelProps={{shrink: true,}}
                                        label={I18n.t('sch_from')}
                                        margin="normal"
                                    />),
                                    (<TextField
                                        className={this.props.classes.inputTime}
                                        key="exactTimeTo"
                                        value={this.state.schedule.time.end}
                                        //InputProps={{inputComponent: TextTime}}
                                        onChange={e => {
                                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                            schedule.time.end = e.target.value;
                                            this.onChange(schedule);
                                        }}
                                        InputLabelProps={{shrink: true,}}
                                        label={I18n.t('sch_to')}
                                        margin="normal"
                                    />)
                                ]}
                            </div>
                        </div>)}

                        {!schedule.time.exactTime && (<div><FormControlLabel control={<Radio className={this.props.classes.inputRadio} checked={wholeDay} onClick={() => {
                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                            schedule.time.start = '00:00';
                            schedule.time.end = '24:00';
                            this.onChange(schedule);
                        }}/>} label={I18n.t('sch_wholeDay')} /></div>) }

                        {!schedule.time.exactTime && (<div><FormControlLabel control={<Radio className={this.props.classes.inputRadio} checked={day} onClick={() => {
                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                            schedule.time.start = 'sunrise';
                            schedule.time.end = 'sunset';
                            this.onChange(schedule);
                        }}/>} label={I18n.t('sch_astroDay')} /></div>) }

                        {!schedule.time.exactTime && (<div><FormControlLabel control={<Radio className={this.props.classes.inputRadio} checked={night} onClick={() => {
                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                            schedule.time.start = 'sunset';
                            schedule.time.end = 'sunrise';
                            this.onChange(schedule);
                        }}/>} label={I18n.t('sch_astroNight')} /></div>) }
                    </div>
                    {!schedule.time.exactTime && this.getPeriodSettingsMinutes()}
                </div>
            </div>);
    }

    getTimeExactElements() {
        const isAstro = ASTRO.indexOf(this.state.schedule.time.start) !== -1;

        return (<div key="timeExact"  className={this.props.classes.rowDiv}>
            <div className={this.props.classes.modeDiv}>
                <FormControlLabel control={<Radio className={this.props.classes.inputRadio} checked={this.state.schedule.time.exactTime} onClick={() => {
                    const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                    schedule.time.exactTime = true;
                    this.onChange(schedule);
                }}/>} label={I18n.t('sch_exactTime')} />
            </div>
            {this.state.schedule.time.exactTime &&
                (<Select value={isAstro ? this.state.schedule.time.start : '00:00'}
                         onChange={e => {
                             const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                             schedule.time.start = e.target.value;
                             this.onChange(schedule);
                         }}
                >
                    <MenuItem key="specific" value={'00:00'}>{I18n.t('sch_specificTime')}</MenuItem>
                    {ASTRO.map(event => (<MenuItem key={event} value={event}>{I18n.t('sch_astro_' + event)}</MenuItem>))}
                </Select>)
            }
            {this.state.schedule.time.exactTime && !isAstro &&
                (<div className={this.props.classes.settingsDiv}><TextField
                    className={this.props.classes.inputTime}
                    key="exactTimeValue"
                    value={this.state.schedule.time.start}
                    inputComponent={TextTime}
                    onChange={e => {
                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                        schedule.time.start = e.target.value;
                        this.onChange(schedule);
                    }}
                    InputLabelProps={{shrink: true,}}
                    margin="normal"
                /></div>)
            }
        </div>)
    }

    getDivider() {
        return (<hr className={this.props.classes.hr}/>);
    }

    getPeriodModes() {
        const schedule = this.state.schedule;
        const isOnce = !schedule.period.dows && !schedule.period.months && !schedule.period.dates && !schedule.period.years && !schedule.period.days && !schedule.period.weeks;
        if (isOnce && !schedule.period.once) {
            schedule.period.once = this.now2string(true);
        }

        return [
            // ----- once ---
            (<div key="once" className={this.props.classes.rowDiv + ' ' + this.props.classes.rowOnce}>
                <div className={this.props.classes.modeDiv}>
                    <FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={isOnce} onClick={() => {
                                    const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                    schedule.period.dows = '';
                                    schedule.period.months = '';
                                    schedule.period.dates = '';
                                    schedule.period.years = 0;
                                    schedule.period.weeks = 0;
                                    schedule.period.days = 0;
                                    // schedule.period.once = '';
                                    this.onChange(schedule);
                                }}/>)}
                              label={I18n.t('sch_periodOnce')} />
                </div>
                {isOnce && (<div className={this.props.classes.settingsDiv}>
                    {<TextField
                        className={this.props.classes.inputDate}
                        key="exactDateAt"
                        value={schedule.period.once}
                        //InputProps={{inputComponent: TextTime}}
                        onChange={e => {
                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                            schedule.time.once = e.target.value;
                            this.onChange(schedule);
                        }}
                        InputLabelProps={{shrink: true,}}
                        label={I18n.t('sch_at')}
                        margin="normal"
                    />}
                </div>)}
            </div>),


            // ----- days ---
            (<div key="days" className={this.props.classes.rowDiv + ' ' + this.props.classes.rowDays}>
                <div className={this.props.classes.modeDiv}>
                    <FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={!!schedule.period.days} onClick={() => {
                               const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                               schedule.period.days = 1;
                               schedule.period.dows = '';
                               schedule.period.months = '';
                               schedule.period.dates = '';
                               schedule.period.years = 0;
                               schedule.period.weeks = 0;
                               schedule.period.once = '';
                               this.onChange(schedule);
                           }}/>)}
                           label={I18n.t('sch_periodDaily')} />
                </div>
                <div className={this.props.classes.settingsDiv}>
                    {this.getPeriodSettingsDaily()}
                    {schedule.period.days ? this.getPeriodSettingsWeekdays() : null}
                </div>
            </div>),


            // ----- days of weeks ---
            /*!schedule.period.days && (
                <div key="dows" className={this.props.classes.rowDiv + ' ' + this.props.classes.rowDows}>
                    <div className={this.props.classes.modeDiv}>
                        <FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={!!schedule.period.dows} onClick={() => {
                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                            schedule.period.dows = schedule.period.dows ? '' : '[0,1,2,3,4,5,6]';
                            this.onChange(schedule);
                        }}/>)}
                        label={I18n.t('sch_periodWeekdays')} />
                    </div>
                    <div className={this.props.classes.settingsDiv}>
                        {this.getPeriodSettingsWeekdays()}
                    </div>
                </div>),
*/
            // ----- weeks ---
            (<div key="weeks" className={this.props.classes.rowDiv + ' ' + this.props.classes.rowDows}>
                <div className={this.props.classes.modeDiv}>
                    <FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={!!schedule.period.weeks} onClick={() => {
                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                        schedule.period.weeks = schedule.period.weeks ? 0 : 1;
                        schedule.period.dows = schedule.period.dows || '[0]';
                        schedule.period.months = '';
                        schedule.period.dates = '';
                        schedule.period.years = 0;
                        schedule.period.days = 0;
                        schedule.period.once = '';
                        this.onChange(schedule);
                    }}/>)}
                    label={I18n.t('sch_periodWeekly')} />
                </div>
                <div className={this.props.classes.settingsDiv}>
                    <div className={this.props.classes.settingsDiv}>{this.getPeriodSettingsWeekly()}</div>
                    <div className={this.props.classes.settingsDiv + ' ' + this.props.classes.rowDowsDows}>{this.state.schedule.period.weeks ? this.getPeriodSettingsWeekdays() : null}</div>
                </div>
            </div>),


            // ----- months ---
            (<div key="months" className={this.props.classes.rowDiv + ' ' + this.props.classes.rowMonths}>
                <div className={this.props.classes.modeDiv}>
                    <FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={!!schedule.period.months} onClick={() => {
                           const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                           schedule.period.months = 1;
                           schedule.period.dows = '';
                           schedule.period.dates = '';
                           schedule.period.years = 0;
                           schedule.period.weeks = 0;
                           schedule.period.days = 0;
                           schedule.period.once = '';
                           this.onChange(schedule);
                       }}/>)}
                       label={I18n.t('sch_periodMonthly')} />
                </div>
                <div className={this.props.classes.settingsDiv}>
                    {this.getPeriodSettingsMonthly()}
                    {schedule.period.months ? (<div>
                        <div className={this.props.classes.settingsDiv + ' ' + this.props.classes.rowMonthsDates}>
                            <FormControlLabel control={(<Checkbox className={this.props.classes.inputRadio} checked={!!schedule.period.dates} onClick={() => {
                                const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                schedule.period.months = schedule.period.months || 1;
                                const dates = [];
                                for (let i = 1; i <= 31; i++) {
                                    dates.push(i);
                                }
                                schedule.period.dates = schedule.period.dates || JSON.stringify(dates);
                                schedule.period.dows = '';
                                schedule.period.years = 0;
                                schedule.period.weeks = 0;
                                schedule.period.days = 0;
                                schedule.period.once = '';

                                this.onChange(schedule);
                            }}/>)}
                            label={I18n.t('sch_periodDates')} /></div>
                        <div className={this.props.classes.settingsDiv + ' ' + this.props.classes.rowMonthsDates}>
                            {this.getPeriodSettingsDates()}
                        </div>
                    </div>) : null}
                </div>
            </div>),


            // ----- years ---
            /*(<div key="years" className={this.props.classes.rowDiv + ' ' + this.props.classes.rowYears}>
                <div className={this.props.classes.modeDiv}>
                    <FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={!!schedule.period.years} onClick={() => {
                       const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                       schedule.period.years = 1;
                       schedule.period.dows = '';
                       schedule.period.dates = '';
                       schedule.period.weeks = 0;
                       schedule.period.days = 0;
                       schedule.period.once = '';
                       this.onChange(schedule);
                   }}/>)}
                   label={I18n.t('sch_periodYearly')} />
                </div>
                <div className={this.props.classes.settingsDiv}>
                    {this.getPeriodSettingsYearly()}
                </div>
            </div>),*/
        ];
    }

    getPeriodSettingsMinutes() {
        return (<div style={{display: 'inline-block'}}>
            <label>{I18n.t('sch_every')}</label>
            <Input value={this.state.schedule.time.interval}
                   style={{ verticalAlign: 'bottom'}}
                   className={this.props.classes.inputEvery} type="number" min="1" onChange={e => {
                const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                schedule.time.interval = parseInt(e.target.value, 10);
                this.onChange(schedule);
            }} />
            <Select value={this.state.schedule.time.mode}
                    onChange={e => {
                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                        schedule.period.mode = e.target.value;
                        this.onChange(schedule);
                    }}
            >
                <MenuItem value={PERIODS.minutes}>{I18n.t('sch_periodMinutes')}</MenuItem>
                <MenuItem value={PERIODS.hours}>{I18n.t('sch_periodHours')}</MenuItem>
            </Select>
        </div>);
    }

    getPeriodSettingsWeekdays() {
        // || this.state.schedule.period.dows === '[1, 2, 3, 4, 5]' || this.state.schedule.period.dows === '[0, 6]'
        const schedule = this.state.schedule;
        const isSpecific = schedule.period.dows && schedule.period.dows !== '[1, 2, 3, 4, 5]' && schedule.period.dows !== '[0, 6]';
        return [
            (<div key="workdays"><FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={schedule.period.dows === '[1, 2, 3, 4, 5]'} onClick={() => {
                    const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                    schedule.period.dows = '[1, 2, 3, 4, 5]';
                    if (schedule.period.days) {
                        schedule.period.days = 1;
                    }
                    this.onChange(schedule);
                }}/>)}
                label={I18n.t('sch_periodWeekend')} /></div>),

            (<div key="weekend"><FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={schedule.period.dows === '[0, 6]'} onClick={() => {
                    const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                    schedule.period.dows = '[0, 6]';
                    if (schedule.period.days) {
                        schedule.period.days = 1;
                    }
                    this.onChange(schedule);
                }}/>)}
                label={I18n.t('sch_periodWorkdays')} /></div>),

            (<div key="specific" style={{verticalAlign: 'top'}}><FormControlLabel style={{verticalAlign: 'top'}}
                                                                   control={(<Radio className={this.props.classes.inputRadio} checked={isSpecific} onClick={() => {
                    const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                    schedule.period.dows = '[0,1,2,3,4,5,6]';
                    if (schedule.period.days) {
                       schedule.period.days = 1;
                    }
                    this.onChange(schedule);
                }}/>)
                }
                label={I18n.t('sch_periodWeekdays')} />
                {isSpecific && (schedule.period.days === 1 || schedule.period.weeks) && (<FormGroup row className={this.props.classes.inputGroup} style={{width: 150}}>
                    {[1,2,3,4,5,6,0].map(i =>
                        (<FormControlLabel key={'specific_' + i} className={this.props.classes.inputGroupElement} control={
                              <Checkbox className={this.props.classes.inputSmallCheck} checked={schedule.period.dows.indexOf('' + i) !== -1}
                                    onChange={e => {
                                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                        let dows;
                                        try {
                                            dows = JSON.parse(schedule.period.dows);
                                        } catch (e) {
                                            dows = [];
                                        }
                                        if (e.target.checked && dows.indexOf(i) === -1) {
                                            dows.push(i);
                                        } else if (!e.target.checked && dows.indexOf(i) !== -1) {
                                            dows.splice(dows.indexOf(i), 1);
                                        }
                                        schedule.period.dows = JSON.stringify(dows);
                                        if (schedule.period.days) {
                                            schedule.period.days = 1;
                                        }
                                        this.onChange(schedule);
                                    }}
                              />
                          }
                          label={I18n.t(WEEKDAYS[i])}
                        />))}
                </FormGroup>)}
            </div>),
            ];
    }

    getPeriodSettingsDaily() {
        if (!this.state.schedule.period.days) {
            return;
        }
        const schedule = this.state.schedule;
        return [
            (<div key="every_day"><FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={schedule.period.days === 1 && !schedule.period.dows} onClick={() => {
                                   const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                   schedule.period.days = 1;
                                   schedule.period.dows = '';
                                   this.onChange(schedule);
                               }}/>)}
                                    label={I18n.t('sch_periodEveryDay')} /></div>),
            (<div key="everyN_day"><FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={schedule.period.days > 1} onClick={() => {
                                    const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                    schedule.period.days = 2;
                                    schedule.period.dows = '';
                                    this.onChange(schedule);
                               }}/>)}
                                    label={I18n.t('sch_periodEvery')} />
                {schedule.period.days > 1 && [(<Input key="input" value={this.state.schedule.period.days} className={this.props.classes.inputEvery} type="number" min="2" onChange={e => {
                    const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                    schedule.period.days = parseInt(e.target.value, 10);
                    schedule.period.dows = '';
                    this.onChange(schedule);
                }} />), (<span key="span" style={{paddingRight: 10}}>{I18n.t('sch_periodDay')}</span>)]}
            </div>),
            ];
    }

    getPeriodSettingsWeekly() {
        if (!this.state.schedule.period.weeks) {
            return;
        }
        const schedule = this.state.schedule;
        return [
            (<div key="radios" style={{display: 'inline-block', verticalAlign: 'top'}}>
                    <div><FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={schedule.period.weeks === 1} onClick={() => {
                                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                            schedule.period.weeks = 1;
                                            this.onChange(schedule);
                                        }}/>)
                                        }
                                             label={I18n.t('sch_periodEveryWeek')} /></div>
                    <div>
                        <FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={schedule.period.weeks > 1} onClick={() => {
                                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                            schedule.period.weeks = 2;
                                            this.onChange(schedule);
                                        }}/>)
                                        }
                                        label={I18n.t('sch_periodEvery')} />
                        {schedule.period.weeks > 1 && [(<Input value={this.state.schedule.period.weeks} className={this.props.classes.inputEvery} type="number" min="2" onChange={e => {
                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                            schedule.period.weeks = parseInt(e.target.value, 10);
                            this.onChange(schedule);
                        }} />), (<span>{I18n.t('sch_periodWeek')}</span>)]}
                    </div>
                </div>),
            ];
    }

    getPeriodSettingsDates() {
        if (!this.state.schedule.period.dates) {
            return;
        }
        const schedule = this.state.schedule;

        const dates = [];
        for (let i = 1; i <= 31; i++) {
            dates.push(i);
        }

        const parsedDates = JSON.parse(schedule.period.dates);

        return (
            <FormGroup row className={this.props.classes.inputGroup} style={{maxWidth: 620}}>
                <FormControlLabel className={this.props.classes.inputDateDay}
                    control={
                        <Checkbox className={this.props.classes.inputDateDayCheck} checked={parsedDates.length === 31}
                            onChange={e => {
                                const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                const dates = [];
                                for (let i = 1; i <= 31; i++) {
                                    dates.push(i);
                                }
                                schedule.period.dates = JSON.stringify(dates);
                                this.onChange(schedule);
                            }}
                      />
                    } label={I18n.t('sch_all')}
                />
                <FormControlLabel className={this.props.classes.inputDateDay}
                    control={
                        <Checkbox className={this.props.classes.inputDateDayCheck} checked={!parsedDates.length}
                            onChange={e => {
                                const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                schedule.period.dates = '[]';
                                this.onChange(schedule);
                            }}
                        />
                    } label={I18n.t('sch_no_one')}
                />
                {parsedDates.length !== 31 && !!parsedDates.length && (<FormControlLabel className={this.props.classes.inputDateDay}
                    control={
                        <Checkbox className={this.props.classes.inputDateDayCheck} checked={false}
                            onChange={e => {
                                const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                const result = [];
                                const parsedDates = JSON.parse(schedule.period.dates);
                                for (let i = 1; i <= 31; i++) {
                                    if (parsedDates.indexOf(i) === -1) {
                                        result.push(i);
                                    }
                                }
                                schedule.period.dates = JSON.stringify(result);
                                this.onChange(schedule);
                            }}
                        />
                    } label={I18n.t('sch_invert')}
                />)}
                <div/>
            {dates.map(i =>
                (<FormControlLabel key={'date_' + i} className={this.props.classes.inputDateDay} style={!i ? {opacity: 0, cursor: 'default', userSelect: 'none', pointerEvents: 'none'}: {}}
                      control={
                          <Checkbox className={this.props.classes.inputDateDayCheck} checked={JSON.parse(schedule.period.dates).indexOf(i) !== -1}
                                    onChange={e => {
                                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                        let dates;
                                        try {
                                            dates = JSON.parse(schedule.period.dates);
                                        } catch (e) {
                                            dates = [];
                                        }
                                        if (e.target.checked && dates.indexOf(i) === -1) {
                                            dates.push(i);
                                        } else if (!e.target.checked && dates.indexOf(i) !== -1) {
                                            dates.splice(dates.indexOf(i), 1);
                                        }
                                        schedule.period.dates = JSON.stringify(dates);
                                        this.onChange(schedule);
                                    }}
                          />
                      } label={i < 10 ? [(<span key="0" style={{opacity: 0}}>0</span>), (<span key="num">{i}</span>)] : i}
                />))}
            </FormGroup>);
    }

    getPeriodSettingsMonthly() {
        if (!this.state.schedule.period.months) {
            return;
        }
        const schedule = this.state.schedule;
        return [
            (<div key="every"><FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={typeof schedule.period.months === 'number' && schedule.period.months === 1} onClick={() => {
                                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                        schedule.period.months = 1;
                                        this.onChange(schedule);
                                    }}/>)
                                    }
                                    label={I18n.t('sch_periodEveryMonth')} /></div>),
            (<div key="everyN"><FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={typeof schedule.period.months === 'number' && schedule.period.months > 1} onClick={() => {
                                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                        schedule.period.months = 2;
                                        this.onChange(schedule);
                                    }}/>)
                                    }
                                    label={I18n.t('sch_periodEvery')} />
                {typeof schedule.period.months === 'number' && schedule.period.months > 1 && [(<Input value={schedule.period.months} className={this.props.classes.inputEvery} type="number" min="2" onChange={e => {
                    const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                    schedule.period.months = parseInt(e.target.value, 10);
                    this.onChange(schedule);
                }} />), (<span>{I18n.t('sch_periodMonth')}</span>)]}
            </div>),
            (<div  key="specific" style={{verticalAlign: 'top'}}><FormControlLabel style={{verticalAlign: 'top'}} control={(<Radio className={this.props.classes.inputRadio} checked={typeof schedule.period.months === 'string'} onClick={() => {
                                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                        schedule.period.months = '[1,2,3,4,5,6,7,8,9,10,11,12]';
                                        this.onChange(schedule);
                                    }}/>)
                                    }
                                    label={I18n.t('sch_periodSpecificMonths')} />
                {typeof schedule.period.months === 'string' &&
                (<FormGroup row className={this.props.classes.inputGroup}>
                    {MONTHS.map((month, i) => (<FormControlLabel className={this.props.classes.inputGroupElement}
                        control={
                            <Checkbox className={this.props.classes.inputSmallCheck} checked={JSON.parse(schedule.period.months).indexOf(i + 1) !== -1}
                                      onChange={e => {
                                          const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                          let months;
                                          try {
                                              months = JSON.parse(schedule.period.months);
                                          } catch (e) {
                                              months = [];
                                          }
                                          if (e.target.checked && months.indexOf(i + 1) === -1) {
                                              months.push(i + 1);
                                          } else if (!e.target.checked && months.indexOf(i + 1) !== -1) {
                                              months.splice(months.indexOf(i + 1), 1);
                                          }
                                          schedule.period.months = JSON.stringify(months);
                                          this.onChange(schedule);
                                      }}
                            />
                        }
                        label={I18n.t(month)}
                    />))}
                </FormGroup>)}
            </div>),
        ];
    }

    getPeriodSettingsYearly() {
        if (!this.state.schedule.period.years) {
            return;
        }
        const schedule = this.state.schedule;
        return [
            (<div><FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={schedule.period.years === 1} onClick={() => {
                                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                        schedule.period.years = 1;
                                        this.onChange(schedule);
                                    }}/>)
                                    }
                                    label={I18n.t('sch_periodEveryYear')} /></div>),
            (<div><FormControlLabel control={(<Radio className={this.props.classes.inputRadio} checked={schedule.period.years > 1} onClick={() => {
                                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                        schedule.period.years = 2;
                                        this.onChange(schedule);
                                    }}/>)
                                    }
                                    label={I18n.t('sch_periodEvery')} />
                {schedule.period.years > 1 && [(<Input value={this.state.schedule.period.years} className={this.props.classes.inputEvery} type="number" min="2" onChange={e => {
                    const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                    schedule.period.years = parseInt(e.target.value, 10);
                    this.onChange(schedule);
                }} />), (<span>{I18n.t('sch_periodYear')}</span>)]}
            </div>),
        ];
    }

    now2string(isEnd) {
        const d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        if (isEnd) {
            d.setDate(d.getDate() + 2);
            d.setMilliseconds(d.getMilliseconds() - 1);
        }

        return padding(d.getDate()) + '.' + padding(d.getMonth() + 1) + '.' + padding(d.getFullYear());
    }

    string2date(str) {
        const parts = str.split('.');
        return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }

    getValidSettings() {
        const schedule = this.state.schedule;
        // ----- from ---
        return (
            <div className={this.props.classes.rowDiv}>
                <div className={this.props.classes.modeDiv} style={{verticalAlign: 'middle'}}>
                    <span style={{fontWeight: 'bold', paddingRight: 10}}>{I18n.t('sch_valid')}</span>
                    <span>{I18n.t('sch_validFrom')}</span>
                </div>
                <div className={this.props.classes.settingsDiv}>
                    <TextField
                        className={this.props.classes.inputDate}
                        style={{marginRight: 10}}
                        key="exactTimeFrom"
                        value={schedule.valid.from}
                        //inputComponent={TextDate}
                        onChange={e => {
                            const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                            schedule.valid.from = e.target.value;
                            this.onChange(schedule);
                        }}
                        InputLabelProps={{shrink: true,}}
                        margin="normal"
                    />
                    <FormControlLabel control={(<Checkbox className={this.props.classes.inputRadio} checked={!!schedule.valid.to} onClick={() => {
                        const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                        schedule.valid.to = schedule.valid.to ? '' : this.now2string(true);
                        this.onChange(schedule);
                    }}/>)}
                        label={I18n.t('sch_validTo')} />
                        {!!schedule.valid.to && (
                            <TextField
                                className={this.props.classes.inputDate}
                                style={{marginRight: 10}}
                                key="exactTimeFrom"
                                value={schedule.valid.to}
                                //inputComponent={TextDate}
                                onChange={e => {
                                    const schedule = JSON.parse(JSON.stringify(this.state.schedule));
                                    schedule.valid.to = e.target.value;
                                    this.onChange(schedule);
                                }}
                                InputLabelProps={{shrink: true,}}
                                margin="normal"
                            />)}
                </div>
            </div>
        );
    }

    render() {
        return (<div>
            <div>{this.state.desc}</div>
            <h5>{I18n.t('sch_time')}</h5>
            {this.getTimePeriodElements()}
            {this.getTimeExactElements()}
            {this.getDivider()}
            <h5>{I18n.t('sch_period')}</h5>
            {this.getPeriodModes()}
            {!this.state.schedule.period.once && this.getDivider()}
            {!this.state.schedule.period.once && this.getValidSettings()}
        </div>);
    }
}

Schedule.propTypes = {
    schedule: PropTypes.string,
    onChange: PropTypes.func
};

export default withStyles(styles)(Schedule);

