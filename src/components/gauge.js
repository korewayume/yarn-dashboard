import * as d3 from "d3";

class Gauge {
  constructor(element, configuration) {
    const self = this;
    self.element = element;
    self.config = configuration;
    self.config.size = configuration.size * 0.9;
    self.config.raduis = (self.config.size * 0.97) / 2;
    self.config.cx = self.config.size / 2;
    self.config.cy = self.config.size / 2;
    self.config.gColor = configuration.gColor || "rgba(50, 205, 50 ,0.8)";
    self.config.yColor = configuration.yColor || "rgba(255, 140, 0 ,0.8)";
    self.config.rColor = configuration.rColor || "rgba(255, 70, 30, 0.8)";
    self.config.transitionDuration = configuration.transitionDuration || 500;

    self.render = function () {
      self.body = d3
        .select(self.element)
        .append("svg:svg")
        .classed("gauge", true)
        .attr("width", self.config.size)
        .attr("height", self.config.size);
      self.body
        .append("svg:circle")
        .attr("cx", self.config.cx)
        .attr("cy", self.config.cy)
        .attr("r", self.config.raduis)
        .style("fill", "#CCCCCC")
        .style("stroke", "#000000")
        .style("stroke-width", "0.5px");
      self.body
        .append("svg:circle")
        .attr("cx", self.config.cx)
        .attr("cy", self.config.cy)
        .attr("r", 0.9 * self.config.raduis)
        .style("fill", "#FFFFFF")
        .style("stroke", "#E0E0E0")
        .style("stroke-width", "2px");
      let fontSize = Math.round(self.config.size / 16);
      if (undefined !== self.config.label) {
        const arcPoints = d3.ticks(0, 100, 30)
          .map(tick => self.percentageToPoint(tick / 100, 0.6));
        const arcLine = d3
          .line()
          .x(d => d.x)
          .y(d => d.y)
          .curve(d3.curveBasisOpen);
        self.body
          .append("defs")
          .data([arcPoints])
          .append("svg:path")
          .attr("d", arcLine)
          .attr("id", "text-path");
        const labelText = self.body
          .append("svg:text")
          .attr("dy", fontSize / 2)
          .attr("text-anchor", "middle");
        labelText.append("svg:textPath")
          .attr("xlink:href", "#text-path")
          .attr("startOffset", "50%")
          .text(self.config.label)
          .style("font-size", `${fontSize}px`)
          .style("fill", "#333333")
          .style("stroke-width", "0px");
      }

      if (undefined !== self.config.unit) {
        self.body
          .append("svg:text")
          .attr("x", self.config.cx)
          .attr("y", self.config.cy + 0.2 * self.config.raduis)
          .attr("dy", fontSize / 2)
          .attr("text-anchor", "middle")
          .text(self.config.unit)
          .style("font-size", `${fontSize}px`)
          .style("fill", "#333333")
          .style("stroke-width", "0px");
      }

      self.bandScaler = d3.scaleLinear()
        .domain([0, 1])
        .range([-Math.PI * 3 / 4, Math.PI * 3 / 4]);

      // 绿
      self.body
        .append("svg:path")
        .classed("g-band", true)
        .style("fill", self.config.gColor)
        .attr("transform", () => `translate(${self.config.cx}, ${self.config.cy})`)
        .attr(
          "d",
          d3.arc()
            .startAngle(self.bandScaler(0))
            .endAngle(self.bandScaler(0))
            .innerRadius(0.65 * self.config.raduis)
            .outerRadius(0.85 * self.config.raduis)
        );
      // 黄
      self.body
        .append("svg:path")
        .classed("y-band", true)
        .style("fill", self.config.yColor)
        .attr("transform", () => `translate(${self.config.cx}, ${self.config.cy})`)
        .attr(
          "d",
          d3.arc()
            .startAngle(self.bandScaler(0))
            .endAngle(self.bandScaler(0))
            .innerRadius(0.65 * self.config.raduis)
            .outerRadius(0.85 * self.config.raduis)
        );
      // 红
      self.body
        .append("svg:path")
        .classed("r-band", true)
        .style("fill", self.config.rColor)
        .attr("transform", () => `translate(${self.config.cx}, ${self.config.cy})`)
        .attr(
          "d",
          d3.arc()
            .startAngle(self.bandScaler(0))
            .endAngle(self.bandScaler(0))
            .innerRadius(0.65 * self.config.raduis)
            .outerRadius(0.85 * self.config.raduis)
        );

      for (const idx of d3.range(21)) {
        const tick = 0.05;
        const percentage = tick * idx;
        if (idx % 5 === 0) {
          const p1 = self.percentageToPoint(percentage, 0.85);
          const p2 = self.percentageToPoint(percentage, 0.7);
          self.body
            .append("svg:line")
            .attr("x1", p1.x)
            .attr("y1", p1.y)
            .attr("x2", p2.x)
            .attr("y2", p2.y)
            .style("stroke", "#333333")
            .style("stroke-width", "2px");
        } else {
          const p1 = self.percentageToPoint(percentage, 0.85);
          const p2 = self.percentageToPoint(percentage, 0.75);
          self.body
            .append("svg:line")
            .attr("x1", p1.x)
            .attr("y1", p1.y)
            .attr("x2", p2.x)
            .attr("y2", p2.y)
            .style("stroke", "#666666")
            .style("stroke-width", "1px");
        }

      }

      let point = self.percentageToPoint(0, 0.70);
      self.body
        .append("svg:text")
        .attr("x", point.x)
        .attr("y", point.y)
        .attr("dy", fontSize / 3)
        .attr("text-anchor", "start")
        .text(0)
        .style("font-size", fontSize + "px")
        .style("fill", "#333333")
        .style("stroke-width", "0px");

      point = self.percentageToPoint(1, 0.67);
      self.body
        .append("svg:text")
        .classed("max-resource", true)
        .attr("x", point.x)
        .attr("y", point.y)
        .attr("dy", fontSize / 3)
        .attr("text-anchor", "end")
        .text(100)
        .style("font-size", fontSize + "px")
        .style("fill", "#333333")
        .style("stroke-width", "0px");

      const pointerContainer = self.body.append("svg:g").attr("class", "pointerContainer");
      pointerContainer
        .selectAll("text")
        .data([0])
        .enter()
        .append("svg:text")
        .attr("x", self.config.cx)
        .attr("y", self.config.size - self.config.cy / 4 - fontSize)
        .attr("dy", fontSize / 2)
        .attr("text-anchor", "middle")
        .style("font-size", fontSize + "px")
        .style("fill", "#000")
        .style("stroke-width", "0px");

      const pointerPath = self.buildPointerPath();
      const pointerLine = d3
        .line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBasis);
      pointerContainer
        .selectAll("path")
        .data([pointerPath])
        .enter()
        .append("svg:path")
        .attr("d", pointerLine)
        .style("fill", "#dc3912")
        .style("stroke", "#c63310")
        .style("fill-opacity", 0.7)
        .attr("transform", `translate(${self.config.cx}, ${self.config.cy}) rotate(0)`);
      pointerContainer
        .append("svg:circle")
        .attr("cx", self.config.cx)
        .attr("cy", self.config.cy)
        .attr("r", 0.12 * self.config.raduis)
        .style("fill", "#4684EE")
        .style("stroke", "#666666")
        .style("opacity", 1);
    };

    self.buildPointerPath = function () {
      const tailDelta = 0.1;
      const head = 0;
      const tail = 180 / 270;
      const p1 = percentageToPoint(head, 0.85);
      const p3 = percentageToPoint(tail - tailDelta, 0.12);
      const p4 = percentageToPoint(tail, 0.28);
      const p5 = percentageToPoint(tail + tailDelta, 0.12);
      return [p1, p3, p4, p5, p1];
    };

    self.percentageToPoint = function (percentage, factor = 1) {
      const {x, y} = percentageToPoint(percentage, factor);
      return {
        x: self.config.cx + x,
        y: self.config.cy + y
      };
    };

    const percentageToPoint = function (percentage, factor = 1) {
      const radius = self.config.raduis;
      const degrees = 135 + 270 * percentage;
      const radians = degrees * Math.PI / 180;
      return {
        x: radius * factor * Math.cos(radians),
        y: radius * factor * Math.sin(radians)
      };
    };

    self.update = function (value, steadyFairResources, fairResources, maxResources) {
      const pointerContainer = self.body.select(".pointerContainer");
      pointerContainer.selectAll("text").text(Math.round(value));
      const pointer = pointerContainer.selectAll("path");
      pointer
        .transition()
        .duration(
          self.config.transitionDuration
        )
        .attrTween("transform", () => {
          let pointerValue = value;
          if (value > maxResources) {
            pointerValue = 1.02 * maxResources;
          } else if (value < 0) {
            pointerValue = -0.02 * maxResources;
          }
          const targetRotation = (pointerValue / maxResources) * 270;
          const currentRotation = self._currentRotation || 0;
          self._currentRotation = targetRotation;
          return function (step) {
            const rotation = currentRotation + (targetRotation - currentRotation) * step;
            return `translate(${self.config.cx}, ${self.config.cy}) rotate(${rotation})`;
          };
        });

      const gBandDomain = [0, steadyFairResources / maxResources];
      const yBandDomain = fairResources > steadyFairResources ? [steadyFairResources / maxResources, fairResources / maxResources] : [0, 0];
      const rBandDomain = fairResources > steadyFairResources ? [fairResources / maxResources, 1] : [steadyFairResources / maxResources, 1];

      self.body.select("path.g-band")
        .attr(
          "d",
          d3.arc()
            .startAngle(self.bandScaler(gBandDomain[0]))
            .endAngle(self.bandScaler(gBandDomain[1]))
            .innerRadius(0.65 * self.config.raduis)
            .outerRadius(0.85 * self.config.raduis)
        );

      self.body.select("path.y-band")
        .attr(
          "d",
          d3.arc()
            .startAngle(self.bandScaler(yBandDomain[0]))
            .endAngle(self.bandScaler(yBandDomain[1]))
            .innerRadius(0.65 * self.config.raduis)
            .outerRadius(0.85 * self.config.raduis)
        );

      self.body.select("path.r-band")
        .attr(
          "d",
          d3.arc()
            .startAngle(self.bandScaler(rBandDomain[0]))
            .endAngle(self.bandScaler(rBandDomain[1]))
            .innerRadius(0.65 * self.config.raduis)
            .outerRadius(0.85 * self.config.raduis)
        );

      self.body.select("text.max-resource").text(Math.round(maxResources))
    };

    self.render();
  }
}

export default Gauge;
