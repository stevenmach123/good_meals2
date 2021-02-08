utility$newDate<-paste(utility$Year,utility$Month,01,sep="/")
utility_l <-subset(utility,newDate >="2002/5/1" )
ggplot(utility, aes(x=newDate, y=10*Gas_Th_per_Day,group=1)) + geom_line(colour="#4488FF") + geom_line(aes(y=Temp_F, colour="#FFFFFF",group=1))


utility_l$E_Cost
ggplot(utility_l,aes(newDate,E_kWh_per_Day,colour="blue"))+geom_smooth(aes(group =1)) +geom_smooth(aes(y=E_Cost,color="purple",group=1)) +geom_smooth(aes(y=Gas_Th_per_Day,color="red",group=1))+geom_smooth(aes(y=Temp_F,color="yellow",group=1))
ggplot(utility_l,aes(newDate,y=E_kWh_per_Day,colour="blue"))+geom_smooth(aes(group =1)) +geom_smooth(aes(y=E_Cost,color="purple",group=1)) +geom_smooth(aes(y=Gas_Th_per_Day,color="red",group=1))+geom_smooth(aes(y=Temp_F,color="yellow",group=1))

utility[complete.cases(utility), ]
utility <- utility[complete.cases(utility), ]

geom_dot