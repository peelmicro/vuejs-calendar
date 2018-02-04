<template>
  <section>
    <div id="header">
      <div>
        <h1>Vue.js Calendar</h1>
      </div>
      <div>
        <current-month></current-month>
      </div>
    </div>
    <div id="day-bar">
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fry</div>
      <div>Sat</div>
      <div>Sun</div>
    </div>
    <div id="calendar">
      <div v-for="week in weeks" :key="week.key" class="calendar-week">
        <calendar-day v-for="day in week" :key="day.key" :day="day"></calendar-day>
      </div>
    </div>
    <event-form></event-form>
  </section>
</template>
<script>
  import CalendarDay from './CalendarDay.vue';
  import CurrentMonth from './CurrentMonth.vue';
  import EventForm from './EventForm.vue';
  export default {
    computed: {
      year() {
        return this.$store.state.currentYear;
      },
      month() {
        return this.$store.state.currentMonth;
      },
      days() {

        // generate all days in current mnonth
        let days = [];
        let currentDay = this.$moment(`${this.year}-${this.month}-1`, 'YYYY-M-D');
        do {
          days.push(currentDay);
          currentDay = this.$moment(currentDay).add(1, 'days');
        } while((currentDay.month() + 1) === this.month)

        // Add previous days to start
        currentDay = this.$moment(days[0]);
        const MONDAY = 1;
        if ((currentDay.day()) !== MONDAY) {
          do {
            currentDay = this.$moment(currentDay).subtract(1, 'days');
            days.unshift(currentDay);
          } while((currentDay.day()) !== MONDAY)
        }

        // Add following days to end
        currentDay = this.$moment(days[days.length-1]);
        const SUNDAY = 0;
        if ((currentDay.day()) !== SUNDAY) {
          do {
            currentDay = this.$moment(currentDay).add(1, 'days');
            days.push(currentDay);
          } while((currentDay.day()) !== SUNDAY)
        }

        return days;
      },
      weeks() {
        let weeks = [];
        let week = [];
        for (let day of this.days) {
          week.push(day);
          if (week.length === 7) {
            weeks.push(week);
            week = [];
          }
        }
        return weeks;
      }
    },
    components: {
      CalendarDay,
      CurrentMonth,
      EventForm
    }
  }
</script>

