class Instance {
    test = 2;
}
const test = '';
runOnStartup(async (runtime)=>{
    console.log(Instance, 1, 2, test);
    runtime.addEventListener('beforeprojectstart', ()=>OnBeforeProjectStart(runtime));
});
async function OnBeforeProjectStart(runtime) {
    runtime.addEventListener('tick', ()=>Tick(runtime));
}
function Tick(runtime) {}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvbGxvc3QvRG9jdW1lbnRzL0dpdEh1Yi9Qcm9qZWN0cy9AbG9zdGltaW5kL2MzLXByb2plY3QvdGVzdC9zY3JpcHRzL2FwcC9pbnN0YW5jZXMvaW5kZXgudHMiLCJmaWxlOi8vL0M6L1VzZXJzL2xsb3N0L0RvY3VtZW50cy9HaXRIdWIvUHJvamVjdHMvQGxvc3RpbWluZC9jMy1wcm9qZWN0L3Rlc3Qvc2NyaXB0cy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFPLE1BQU07SUFDVCxPQUFPLEVBQUM7QUFDWjtBQ0ZBLE1BQU0sT0FBTTtBQU1aLGFBQWEsT0FBTTtJQUVsQixRQUFRLEdBQUcsV0FBVyxHQUFHLEdBQUc7SUFLNUIsUUFBUSxnQkFBZ0IsQ0FBQyxzQkFBc0IsSUFBTSxxQkFBcUI7QUFDM0U7QUFFQSxlQUFlLHFCQUFxQixPQUFpQjtJQUtwRCxRQUFRLGdCQUFnQixDQUFDLFFBQVEsSUFBTSxLQUFLO0FBQzdDO0FBRUEsU0FBUyxLQUFLLE9BQWlCLEdBRS9CIn0=