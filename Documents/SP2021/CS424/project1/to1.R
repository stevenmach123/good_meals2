read.table(file = "~/Documents/SP2021/CS424/annual_generation_state.csv", sep = ",", header = TRUE)

names(ultility)[names(ultility) == "GENERATION..Megawatthours."] <- "Wat"
names(ultility)[names(ultility) == "TYPE.OF.PRODUCER"] <- "type" 
names(ultility)[names(ultility) == "ENERGY.SOURCE"] <- "source"
names(ultility)[names(ultility) == "YEAR"] <- "year"
names(ultility)[names(ultility) == "STATE"] <- "state"


ultility<-subset(ultility, state != "  " & Wat >-1 & source!="Other" & source!="Other Gases" & source != "Other Biomass" & source!="Pumped Storage")
unique(ultility$source)

ultility$state[ultility$state] <-toupper(ultility$state)
ultility$source[ultility$source == "Hydroelectric Conventional"]  <- "Hydro"
ultility$source[ultility$source == "Solar Thermal and Photovoltaic"] <- "Solar"
ultility$source[ultility$source == "Natural Gas"] <- "Gas"
ultility$source[ultility$source == "Wood and Wood Derived Fuels"] <- "Wood"

gsub(",","",ultility$Wat,fixed=TRUE)
ultility$Wat<-gsub(",","",ultility$Wat,fixed=TRUE)
ultility$Wat <-as.numeric(ultility$Wat)

y2018 <-subset(ultility,year==2018)
y2018 <- subset(ultility,year==2018 & state !="US-Total")
#ggplot(y2018,aes(Wat,fill =state)) + geom_bar(position="stack",stat="identity")
ggplot(y2018,aes(x="",y=Wat,fill =source)) + geom_bar(position="stack",stat="sum")
ggplot(y2018,aes(x="",y=Wat,fill =source)) + geom_bar(position="stack",stat="identity",na.rm=TRUE)



gsub(".","",ultility$Wat,fixed =TRUE)